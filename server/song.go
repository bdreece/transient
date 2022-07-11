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
	"log"
	"mime"
	"os"

	"github.com/vincent-petithory/dataurl"
)

type FileData struct {
	Data   string `json:"data"`
	Format string `json:"format"`
}

func (d FileData) Store(filePath *string, id string, verbose *bool) (*FileStore, error) {
	// Decode data URL
	data, err := dataurl.DecodeString(d.Data)
	if err != nil {
		if *verbose {
			log.Printf("Failed to decode file data: %v\n", err)
		}
		return nil, err
	}

	// Get file extension
	ext, err := mime.ExtensionsByType(data.MediaType.ContentType())
	if err != nil {
		if *verbose {
			log.Printf("Failed to get file extensions for type: %v\n", err)
		}
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

func (s SongData) Store(filePath *string, id string, verbose *bool) (*SongStore, error) {
	// Store image
	var (
		image, audio *FileStore
		err          error
	)
	if s.Image.Data != "" {
		image, err = s.Image.Store(filePath, id, verbose)
		if err != nil {
			if *verbose {
				log.Printf("Error storing image data: %v\n", err)
			}
			return nil, err
		}
	} else {
		image = new(FileStore)
	}

	// Store audio
	audio, err = s.Audio.Store(filePath, id, verbose)
	if err != nil {
		if *verbose {
			log.Printf("Error storing audio data: %v\n", err)
		}
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

func (s SongStore) Data(verbose *bool) (*SongData, error) {
	var (
		image, audio *FileData = nil, nil
		err          error
	)

	if s.Image.Path != "" {
		image, err = s.Image.Data()
		if err != nil {
			if *verbose {
				log.Printf("Failed to load image data: %v\n", err)
			}
			return nil, err
		}
	} else {
		image = new(FileData)
	}
	audio, err = s.Audio.Data()
	if err != nil {
		if *verbose {
			log.Printf("Failed to load audio data: %v\n", err)
		}
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
