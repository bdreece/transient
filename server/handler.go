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
	"encoding/json"
	"net/http"
	"time"

	"github.com/gorilla/mux"
)

type Song struct {
	TrackName  string
	ArtistName string
	Audio      []byte
	Format     string
	Expiration time.Time
	MaxPlays   int
}

func NewSong() (s Song) { return }

type SongHandler struct {
	bag Bag[Song]
}

func NewSongHandler() *SongHandler {
	return &SongHandler{
		bag: NewBag[Song](),
	}
}

func (h *SongHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]
	switch r.Method {
	case "POST":
		var rawBody []byte
		_, err := r.Body.Read(rawBody)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
		}

		song := NewSong()
		json.Unmarshal(rawBody, &song)

		h.bag.Push(id, song.MaxPlays, &song)
		w.WriteHeader(http.StatusOK)
	case "GET":
		song := h.bag.Pop(id)
		if song == nil {
			w.WriteHeader(http.StatusNoContent)
		}
		bytes, err := json.Marshal(song)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
		}
		w.Write(bytes)
	}
}
