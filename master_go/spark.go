package main

import (
	"bufio"
	"log"
	"os"
	"os/exec"
)

//exported for use by ethereum.go
var sparkLogName = ""

func getSparkLog() (string, error) {
	text, err := readFileWithLines(sparkLogName)

	return text, err
}

//TODO: implement
func getSparkUILog() (string, error) {
	//text, err := readFile(sparkUILogName)
	text := ""
	return text, nil
}

func startSpark() {
	log.Println("starting spark...")
	//create the path for the log file
	exec.Command("mkdir", "-p", config.Spark.Log4J.Directory)
	sparkLogName = config.Spark.Log4J.Directory + "/sparkLogging"
	exec.Command("touch", sparkLogName)

	//create the spark logging config file
	sparkLogConfigName := config.Spark.Directory + "/conf/log4j.properties"
	exec.Command("cp", "/dev/null", sparkLogConfigName)
	sparkLogConfigFile, _ := os.Create(sparkLogConfigName)

	//write the logging config from the general config json
	slcw := bufio.NewWriter(sparkLogConfigFile)
	slcw.WriteString("log4j.rootCategory=" + config.Spark.Log4J.RootCategory + "\n")
	slcw.WriteString("log4j.appender.file=" + config.Spark.Log4J.Appender + "\n")
	slcw.WriteString("log4j.appender.file.File=" + sparkLogName + "\n")
	slcw.WriteString("log4j.appender.file.maxFileSize=" + config.Spark.Log4J.MaxFileSize + "\n")
	slcw.WriteString("log4j.appender.file.layout=" + config.Spark.Log4J.Layout + "\n")
	slcw.WriteString("log4j.appender.file.layout.ConversionPattern=" + config.Spark.Log4J.ConversionPattern + "\n")
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

	//TODO: fix so slave isn't started til after enabled in webui
	master := config.Spark.Directory + "/sbin/start-master.sh"
	slave := config.Spark.Directory + "/sbin/start-slave.sh"
	slaveArg := "spark://" + config.Spark.Master.IP + ":" + config.Spark.Master.Port

	_, err := exec.Command(master).CombinedOutput()
	if err != nil {
		log.Println("error with starting spark master")
		log.Fatal(err.Error())
	}

	_, err = exec.Command(slave, slaveArg).CombinedOutput()

	if err != nil {
		//This is most likely due to the slave already running, TODO: Gracefully handle this case
		//log.Println("error with starting spark slave")
		//log.Println(string(out[:]))
		//log.Fatal(err.Error())
	}

}

func stopSpark() {
	master := config.Spark.Directory + "/sbin/stop-master.sh"
	slave := config.Spark.Directory + "/sbin/stop-slave.sh"

	exec.Command(master).Run()
	exec.Command(slave).Run()
}
