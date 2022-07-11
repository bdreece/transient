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
	"fmt"
	"mime"
	"os"

	"github.com/vincent-petithory/dataurl"
)

type FileData struct {
	Data   string `json:"data"`
	Format string `json:"format"`
}

func (d FileData) Store(filePath *string, id string) (*FileStore, error) {
	// Decode data URL
	data, err := dataurl.DecodeString(d.Data)
	if err != nil {
		return nil, err
	}

	// Get file extension
	ext, err := mime.ExtensionsByType(data.MediaType.ContentType())
	if err != nil {
		return nil, err
	}

	path := fmt.Sprintf("%s/%s.%s", *filePath, id, ext[0])
	err = os.WriteFile(path, data.Data, 0744)
	if err != nil {
		return nil, err
	}
	return &FileStore{
		Path:   path,
		Format: d.Format,
	}, nil
}

type SongData struct {
	TrackName      string   `json:"trackName"`
	ArtistName     string   `json:"artistName"`
	Description    string   `json:"description"`
	Image          FileData `json:"image"`
	Audio          FileData `json:"audio"`
	RemainingPlays int      `json:"remainingPlays"`
}

func NewSongData() (s SongData) { return }

func (s SongData) Store(filePath *string, id string) (*SongStore, error) {
	// Store image
	image, err := s.Image.Store(filePath, id)
	if err != nil {
		return nil, err
	}

	// Store audio
	audio, err := s.Audio.Store(filePath, id)
	if err != nil {
		return nil, err
	}

	return &SongStore{
		TrackName:      s.TrackName,
		ArtistName:     s.ArtistName,
		Description:    s.Description,
		Image:          *image,
		Audio:          *audio,
		RemainingPlays: s.RemainingPlays,
	}, nil
}

type FileStore struct {
	Path   string `json:"path"`
	Format string `json:"format"`
}

func (s FileStore) Data() (*FileData, error) {
	data, err := os.ReadFile(s.Path)
	if err != nil {
		return nil, err
	}

	return &FileData{
		Data:   dataurl.EncodeBytes(data),
		Format: s.Format,
	}, nil
}

type SongStore struct {
	TrackName      string    `json:"trackName"`
	ArtistName     string    `json:"artistName"`
	Description    string    `json:"description"`
	Image          FileStore `json:"image"`
	Audio          FileStore `json:"audio"`
	RemainingPlays int       `json:"remainingPlays"`
}

func (s SongStore) Data() (*SongData, error) {
	image, err := s.Image.Data()
	if err != nil {
		return nil, err
	}
	audio, err := s.Audio.Data()
	if err != nil {
		return nil, err
	}

	return &SongData{
		TrackName:      s.TrackName,
		ArtistName:     s.ArtistName,
		Description:    s.Description,
		Image:          *image,
		Audio:          *audio,
		RemainingPlays: s.RemainingPlays,
	}, nil
}
