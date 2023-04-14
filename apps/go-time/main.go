package main

import (
	"encoding/json"
	"log"
	"net/http"
	"time"
)

func GetCurrentTimeAsJSON(w http.ResponseWriter, r *http.Request) {
	currentTime := time.Now()
	timeJSON, err := timeAsJSONBytes(currentTime)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(timeJSON)
}

func timeAsJSONBytes(t time.Time) ([]byte, error) {
	timeObj := struct {
		Time time.Time `json:"time"`
		Lang string    `json:"lang"`
	}{
		Time: t,
		Lang: "Go",
	}
	timeJSON, err := json.Marshal(timeObj)
	if err != nil {
		return nil, err
	}
	return timeJSON, nil
}

func main() {
	log.Println("Starting go-time server ...")
	http.HandleFunc("/", GetCurrentTimeAsJSON)
	log.Fatal(http.ListenAndServe(":8080", nil))
}
