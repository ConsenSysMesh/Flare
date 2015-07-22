package main

import (
	"bufio"
	"log"
	"os"
	"os/exec"
)

var sparkLogName = ""

func initSpark() {

	//create the path for the log file
	exec.Command("mkdir", "-p", config.Spark.Log4j.Directory)
	sparkLogName = config.Spark.Log4j.Directory + "/sparkLogging"
	exec.Command("touch", sparkLogName)

	//create the spark logging config file
	sparkLogConfigName := config.Spark.Directory + "/conf/log4j.properties"
	exec.Command("cp", "/dev/null", sparkLogConfigName)
	sparkLogConfigFile, _ := os.Create(sparkLogConfigName)

	//write the logging config from the general config json
	slcw := bufio.NewWriter(sparkLogConfigFile)
	slcw.WriteString("log4j.rootCategory=" + config.Spark.Log4j.RootCategory + "\n")
	slcw.WriteString("log4j.appender.file=" + config.Spark.Log4j.Appender + "\n")
	slcw.WriteString("log4j.appender.file.File=" + sparkLogName + "\n")
	slcw.WriteString("log4j.appender.file.maxFileSize=" + config.Spark.Log4j.MaxFileSize + "\n")
	slcw.WriteString("log4j.appender.file.layout=" + config.Spark.Log4j.Layout + "\n")
	slcw.WriteString("log4j.appender.file.layout.ConversionPattern=" + config.Spark.Log4j.ConversionPattern + "\n")
	slcw.Flush()

	//create the spark logging config file
	sparkConfigName := config.Spark.Directory + "/conf/spark-env.sh"
	exec.Command("cp", "/dev/null", sparkConfigName)
	sparkConfigFile, _ := os.Create(sparkConfigName)

	//write the logging config for spark
	scw := bufio.NewWriter(sparkConfigFile)
	scw.WriteString("export SPARK_MASTER_IP=" + config.Spark.Master.IP + "\n")
	scw.WriteString("export SPARK_MASTER_PORT=" + config.Spark.Master.Port + "\n")
	scw.Flush()

	//write the logging config for cassandra
	cassandraConfigName := config.Cassandra.Directory + "/conf/cassandra.yaml"

	cassandraListenIP := "'s/.*listen_address:.*/listen_address: " + config.Cassandra.IP + "/'"
	cassandraRPCIP := "'s/.*rpc_address:.*/rpc_address: " + config.Cassandra.IP + "/'"
	cassandraPort := "'s/.*rpc_port:.*/rpc_port: " + config.Cassandra.Port + "/'"

	_, err := exec.Command("bash", "-c", "sed"+" -i.bak "+cassandraListenIP+" "+cassandraConfigName).CombinedOutput()
	_, err = exec.Command("bash", "-c", "sed"+" -i.bak "+cassandraRPCIP+" "+cassandraConfigName).CombinedOutput()
	if err != nil {
		log.Println("error with setting cassandra ip")
		log.Fatal(err.Error())
	}

	_, err = exec.Command("bash", "-c", "sed"+" -i.bak "+cassandraPort+" "+cassandraConfigName).CombinedOutput()
	if err != nil {
		log.Println("error with setting cassandra port")
		log.Fatal(err.Error())
	}

	//start the node as master and slave and report any errors
	master := config.Spark.Directory + "/sbin/start-master.sh"
	slave := config.Spark.Directory + "/sbin/start-slave.sh"
	slaveArg := "spark://" + config.Spark.Master.IP + ":" + config.Spark.Master.Port

	_, err = exec.Command(master).CombinedOutput()
	if err != nil {
		log.Println("error with starting spark master")
		log.Fatal(err.Error())
	}

	_, err := exec.Command(slave, slaveArg).CombinedOutput()

	if err != nil {
		//This is most likely due to the slave already running, TODO: Gracefully handle this case
		//log.Println("error with starting spark slave")
		//log.Println(string(out[:]))
		//log.Fatal(err.Error())
	}
}
