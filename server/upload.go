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
	Id string
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
		body []byte
		buf  []byte = make([]byte, 1024)
		err  error
		n    int
	)

	// Read all of body
	for true {
		n, err = r.Body.Read(buf)
		if n == 0 {
			break
		}
		body = append(body, buf...)
	}
	if err != nil && err != io.EOF {
		if *h.verbose {
			log.Printf("Unexpected error reading request body: %v\n", err)
		}
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	if *h.verbose {
		log.Printf("Body: %s\n", body)
	}

	// Body is valid JSON
	if !json.Valid(body) {
		if *h.verbose {
			log.Println("Request body is not valid JSON!")
		}
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	// Add body contents to DB with new CUID
	id := cuid.New()
	if err = h.db.Update(func(tx *bolt.Tx) error {
		var bucket *bolt.Bucket
		if bucket, err = tx.CreateBucketIfNotExists([]byte(BUCKET)); err != nil {
			return err
		}
		if err = bucket.Put([]byte(id), body); err != nil {
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
