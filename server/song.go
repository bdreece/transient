package main

type Song struct {
	TrackName      string
	ArtistName     string
	Audio          []byte
	Format         string
	RemainingPlays int
}

func NewSong() (s Song) { return }
