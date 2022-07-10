package main

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/boltdb/bolt"
	"github.com/gorilla/mux"
)

type DownloadHandlerError struct {
	string
}

func (d DownloadHandlerError) Error() string {
	return d.string
}

type DownloadHandler struct {
	db      *bolt.DB
	verbose *bool
}

func NewDownloadHandler(db *bolt.DB, verbose *bool) *DownloadHandler {
	return &DownloadHandler{
		db,
		verbose,
	}
}

func (h *DownloadHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	var song *Song
	id := mux.Vars(r)["id"]

	if err := h.db.Update(func(tx *bolt.Tx) error {
		bucket, err := tx.CreateBucketIfNotExists([]byte(BUCKET))
		if err != nil {
			return err
		}
		// Get data
		data := bucket.Get([]byte(id))
		if data == nil {
			return DownloadHandlerError{"Song ID does not exist"}
		}
		// Unmarshal into Song
		if err = json.Unmarshal(data, song); err != nil {
			return err
		}
		if song == nil {
			return DownloadHandlerError{"Song is nil!"}
		}
		// Decrement remaining plays
		newSong := *song
		newSong.RemainingPlays -= 1
		// Marshal this back into bytes
		data, err = json.Marshal(&newSong)
		if err != nil {
			return err
		}
		// Put updated bytes in DB
		if err = bucket.Put([]byte(id), data); err != nil {
			return err
		}
		return nil
	}); err != nil {
		if *h.verbose {
			log.Printf("Unexpected error downloading song: %v\n", err)
		}
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	data, err := json.Marshal(song)
	if err != nil {
		if *h.verbose {
			log.Printf("Unexpected error marshalling song JSON: %v\n", err)
		}
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	w.Write(data)
}
