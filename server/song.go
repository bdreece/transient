package main

import "time"

type Song struct {
	TrackName      string
	ArtistName     string
	Audio          []byte
	Format         string
	Expiration     time.Time
	RemainingPlays int
}

func NewSong() (s Song) { return }
