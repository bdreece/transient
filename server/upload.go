package main

import (
	"encoding/json"
	"io"
	"log"
	"net/http"

	"github.com/boltdb/bolt"
	"github.com/lucsky/cuid"
)

type UploadResponse struct {
	Id string `json:"id"`
}

type UploadHandler struct {
	db      *bolt.DB
	verbose *bool
}

func NewUploadHandler(db *bolt.DB, verbose *bool) *UploadHandler {
	return &UploadHandler{
		db,
		verbose,
	}
}

func (h *UploadHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	var (
		body   []byte
		length int    = 0
		buf    []byte = make([]byte, 1024)
		err    error
		n      int
	)

	if r.Header["Content-Type"][0] != "application/json" {
		if *h.verbose {
			log.Println("Invalid content type")
		}
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	// Read all of body
	for {
		n, err = r.Body.Read(buf)
		if n == 0 {
			break
		}
		body = append(body, buf...)
		length += n
	}
	if err != nil && err != io.EOF {
		if *h.verbose {
			log.Printf("Unexpected error reading request body: %v\n", err)
		}
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	// Body is valid JSON
	if !json.Valid(body[:length]) {
		if *h.verbose {
			log.Println("Request body is not valid JSON!")
			log.Printf("Request body: %s\n", body)
		}
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	// Add body contents to DB with new CUID
	id := cuid.New()
	if err = h.db.Update(func(tx *bolt.Tx) error {
		bucket, err := tx.CreateBucketIfNotExists([]byte(BUCKET))
		if err != nil {
			return err
		}
		if err = bucket.Put([]byte(id), body[:length]); err != nil {
			return err
		}
		return nil
	}); err != nil {
		if *h.verbose {
			log.Printf("Unexpected error writing to database: %v\n", err)
		}
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	// Marshal response JSON containing CUID
	if body, err = json.Marshal(UploadResponse{Id: id}); err != nil {
		if *h.verbose {
			log.Printf("Unexpected error marshaling response body: %v\n", err)
		}
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	// Write response
	w.Write(body)
}
