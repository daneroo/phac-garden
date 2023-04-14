package main

import (
	"testing"
	"time"
)

func TestTimeAsJSONBytes(t *testing.T) {
	// generate a known time
	importantTime := time.Date(1966, time.May, 16, 0, 0, 0, 0, time.UTC)
	result, err := timeAsJSONBytes(importantTime)
	if err != nil {
		t.Error("Expected no error")
	}
	if string(result) != "{\"time\":\"1966-05-16T00:00:00Z\",\"lang\":\"Go\"}" {
		t.Errorf("Expected value to be 1966-05-16T00:00:00Z but got %s", result)
	}
}
