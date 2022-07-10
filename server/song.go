package main

type Song struct {
	TrackName      string `json:"trackName"`
	ArtistName     string `json:"artistName"`
	Description    string `json:"description"`
	File           []byte `json:"file"`
	Format         string `json:"format"`
	RemainingPlays int    `json:"remainingPlays"`
}

func NewSong() (s Song) { return }
