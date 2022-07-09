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
	"log"
	"net/http"
	"os"
	"os/signal"
	"time"

	"github.com/gorilla/mux"
)

func setup() http.Server {
	r := mux.NewRouter()
	r.HandleFunc("/api/songs/{id}", SongHandler).Methods("GET", "POST")
	return http.Server{
		Handler:      r,
		Addr:         "",
		WriteTimeout: time.Duration(10) * time.Second,
		ReadTimeout:  time.Duration(10) * time.Second,
	}
}

func launch(srv *http.Server) {
	go func() {
		if err := srv.ListenAndServe(); err != nil {
			log.Fatalf("Failed to launch server: %v\n", err)
		}
	}()

	c := make(chan os.Signal, 1)
	signal.Notify(c, os.Interrupt)

	<-c
}

func shutdown(srv *http.Server, ctx context.Context) {
	go func() {
		srv.Shutdown(ctx)
	}()

	<-ctx.Done()
}
