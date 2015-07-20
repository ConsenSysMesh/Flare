package main

import (
	"bufio"
	"log"
	"os"
	"os/exec"
)

func initSpark() {

	//create the path for the log file
	exec.Command("mkdir", "-p", config.Spark.Log4j.Directory)
	logName := config.Spark.Log4j.Directory + "/sparkLogging"
	exec.Command("touch", logName)

	//create the spark logging config file
	sparkConfigName := config.Spark.Directory + "/conf/log4j.properties"
	exec.Command("cp", "/dev/null", sparkConfigName)
	sparkConfigFile, _ := os.Create(sparkConfigName)

	//write the logging config from the general config json
	w := bufio.NewWriter(sparkConfigFile)
	w.WriteString("log4j.rootCategory=" + config.Spark.Log4j.RootCategory + "\n")
	w.WriteString("log4j.appender.file=" + config.Spark.Log4j.Appender + "\n")
	w.WriteString("log4j.appender.file.File=" + logName + "\n")
	w.WriteString("log4j.appender.file.maxFileSize=" + config.Spark.Log4j.MaxFileSize + "\n")
	w.WriteString("log4j.appender.file.layout" + config.Spark.Log4j.Layout + "\n")
	w.WriteString("log4j.appender.file.layout.ConversionPattern=" + config.Spark.Log4j.ConversionPattern + "\n")
	w.Flush()

	//start the node as master and slave and report any errors
	master := config.Spark.Directory + "/sbin/start-master.sh"
	slave := config.Spark.Directory + "/sbin/start-slave.sh"
	slaveArg := "spark://" + config.Spark.Master.IP + ":" + config.Spark.Master.Port

	_, err := exec.Command(master).Output()
	if err != nil {
		log.Println("error with starting spark master")
		log.Fatal(err.Error())
	}
	_, err = exec.Command(slave, slaveArg).Output()

	if err != nil {
		//This is most likely due to the slave already running, TODO: Gracefully handle this case
		//log.Println("error with starting spark slave")
		//log.Println(string(out[:]))
		//log.Fatal(err.Error())
	}
}
