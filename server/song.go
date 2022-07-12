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
	"github.com/lucsky/cuid"
)

type FileData struct {
	Data   string `json:"data"`
	Format string `json:"format"`
}

func storeFile(url string, filePath *string, id string, verbose *bool) (string, error) {
	// Decode data URL
	data, err := dataurl.DecodeString(url)
	if err != nil {
		if *verbose {
			log.Printf("Failed to decode file data: %v\n", err)
		}
		return "", err
	}

	format := data.MediaType.ContentType((
	// Get file extension
	ext, err := mime.ExtensionsByType(format)
	if err != nil {
		if *verbose {
			log.Printf("Failed to get file extensions for type: %v\n", err)
		}
		return "", err
	}

	path := ""
	if len(ext) > 0 {
		path = fmt.Sprintf("%s/%s.%s", *filePath, id, ext[0])
	} else {
		path = fmt.Sprintf("%s/%s-%s", *filePath, id, cuid.Slug())
	}
	err = os.WriteFile(path, data.Data, 0744)
	if err != nil {
		return "", err
	}
	return path, nil
}

type Song struct {
	TrackName      string   `json:"trackName"`
	ArtistName     string   `json:"artistName"`
	Description    string   `json:"description"`
	Image          string `json:"image"`
	Audio          string `json:"audio"`
	RemainingPlays int      `json:"remainingPlays"`
}

func NewSong() (s Song) { return }

func (s *Song) Store(filePath *string, id string, verbose *bool) error {
	var err error
	// Store image
	if s.Image != "" {
		s.Image, err = storeFile(s.Image, filePath, id, verbose)
		if err != nil {
			if *verbose {
				log.Printf("Error storing image data: %v\n", err)
			}
			return err
		}
	}

	// Store audio
	s.Audio, err = storeFile(s.Audio, filePath, id, verbose)
	if err != nil {
		if *verbose {
			log.Printf("Error storing audio data: %v\n", err)
		}
		return err
	}
	return nil
}

func readFile(path string) (string, error) {
	data, err := os.ReadFile(s.Path)
	if err != nil {
		return "", err
	}

	return dataurl.EncodeBytes(data), nil
}

func (s *Song) Data(verbose *bool) error {
	var err error

	if s.Image != "" {
		s.Image, err = readFile(s.Image)
		if err != nil {
			if *verbose {
				log.Printf("Failed to load image data: %v\n", err)
			}
			return err
		}
	}
	s.Audio, err = readFile(s.Audio)
	if err != nil {
		if *verbose {
			log.Printf("Failed to load audio data: %v\n", err)
		}
		return err
	}

	return nil
}
