/* Transient - A temporary audio file sharing service
 * Copyright (C) 2022 Brian Reece
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"time"

	"github.com/boltdb/bolt"
	"github.com/gorilla/mux"
)

const BUCKET = "songs"

func corsHandleFunc(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Max-Age", "86400")

}

func setup(db *bolt.DB, port *int, verbose *bool) http.Server {
	if *verbose {
		log.Println("Hello, server!")
	}

	router := mux.NewRouter()
	// Main API routes
	router.Handle("/api/songs", NewUploadHandler(db, verbose)).Methods(http.MethodPost)
	router.Handle("/api/songs/{id}", NewDownloadHandler(db, verbose)).Methods(http.MethodGet)
	// CORS routes
	router.HandleFunc("/api/songs", corsHandleFunc).Methods(http.MethodOptions)
	router.HandleFunc("/api/songs/{id}", corsHandleFunc).Methods(http.MethodOptions)

	// Not really sure what this does if I still have to add headers above...
	// Silly gorilla mux
	router.Use(mux.CORSMethodMiddleware(router))

	if *verbose {
		log.Println("Configured router")
	}

	return http.Server{
		Handler:      router,
		Addr:         fmt.Sprintf(":%d", *port),
		WriteTimeout: time.Duration(10) * time.Second,
		ReadTimeout:  time.Duration(10) * time.Second,
	}
}

func launch(srv *http.Server, verbose *bool) {
	go func() {
		if err := srv.ListenAndServe(); err != nil {
			if *verbose {
				log.Printf("Failed to launch server: %v\n", err)
			}
			os.Exit(1)
		}
	}()

	if *verbose {
		log.Println("Launched server")
	}

	c := make(chan os.Signal, 1)
	signal.Notify(c, os.Interrupt)

	<-c
}

func shutdown(srv *http.Server, ctx context.Context, verbose *bool) {
	go func() {
		srv.Shutdown(ctx)
	}()

	<-ctx.Done()

	if *verbose {
		log.Println("Goodbye!")
	}
}
