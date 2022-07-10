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

type SongNotFound struct{}

func (e SongNotFound) Error() string {
	return "Song not found!"
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
	var song *Song = new(Song)
	id := mux.Vars(r)["id"]

	if err := h.db.Update(func(tx *bolt.Tx) error {
		bucket, err := tx.CreateBucketIfNotExists([]byte(BUCKET))
		if err != nil {
			return err
		}
		// Get data
		data := bucket.Get([]byte(id))
		if data == nil {
			return SongNotFound{}
		}
		// Unmarshal into Song
		if err = json.Unmarshal(data, song); err != nil {
			return err
		}

		// Decrement remaining plays
		song.RemainingPlays -= 1
		// Marshal this back into bytes
		data, err = json.Marshal(song)
		if err != nil {
			return err
		}
		// Put updated bytes in DB
		if song.RemainingPlays == 0 {
			if err = bucket.Delete([]byte(id)); err != nil {
				return err
			}
		} else if err = bucket.Put([]byte(id), data); err != nil {
			return err
		}
		return nil
	}); err != nil {
		if _, ok := err.(SongNotFound); ok {
			w.WriteHeader(http.StatusNoContent)
			return
		}
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
