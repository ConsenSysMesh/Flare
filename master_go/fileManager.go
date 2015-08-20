package main

import (
	"github.com/ActiveState/tail"
	"log"
	"os"
	"time"
)

func readFileBytesIfModified(lastMod time.Time, filename string) ([]byte, time.Time, error) {
	file, err := os.Stat(filename)
	if err != nil {
		return nil, lastMod, err
	}
	if !file.ModTime().After(lastMod) {
		return nil, lastMod, nil
	}

	// make a buffer to keep chunks that are read
	var data []byte
	t, err := tail.TailFile(filename, tail.Config{Follow: false, Poll: true})
	if err != nil {
		log.Println("logging " + filename)
		log.Fatal(err.Error())
		return nil, lastMod, err
	}
	for line := range t.Lines {
		data = append(data, line.Text...)
	}

	return data, file.ModTime(), nil
}

func readFileBytes(filename string) ([]byte, error) {
	// make a buffer to keep chunks that are read
	var data []byte
	t, err := tail.TailFile(filename, tail.Config{Follow: false, Poll: true})
	if err != nil {
		log.Println("reading " + filename)
		log.Fatal(err.Error())
		return nil, err
	}
	for line := range t.Lines {
		data = append(data, line.Text...)
	}

	return data, nil
}

func readFileBytesIfModifiedWithLines(lastMod time.Time, filename string) ([]byte, time.Time, error) {
	file, err := os.Stat(filename)
	if err != nil {
		return nil, lastMod, err
	}
	if !file.ModTime().After(lastMod) {
		return nil, lastMod, nil
	}

	// make a buffer to keep chunks that are read
	var data []byte
	t, err := tail.TailFile(filename, tail.Config{Follow: false, Poll: true})
	if err != nil {
		log.Println("logging " + filename)
		log.Fatal(err.Error())
		return nil, lastMod, err
	}
	for line := range t.Lines {
		data = append(data, line.Text+"\\n"...)
	}

	return data, file.ModTime(), nil
}

func readFileWithLines(filename string) (string, error) {
	// make a buffer to keep chunks that are read
	t, err := tail.TailFile(filename, tail.Config{Follow: false, Poll: true})

	if err != nil {
		return "", err
	}
	data := ""
	for line := range t.Lines {
		data += line.Text + "\\n"
	}

	return data, nil
}
