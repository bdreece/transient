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
	"os"
	"time"

	"github.com/akamensky/argparse"
	"github.com/boltdb/bolt"
)

const DATA_PATH string = "/var/data/transient"

func main() {
	// Configure command-line arguments
	parser := argparse.NewParser("server", "Transient server application")

	verbose := parser.Flag("v", "verbose", &argparse.Options{
		Required: false,
		Help:     "Enable verbose output",
		Default:  false,
	})

	filePath := parser.String("f", "files", &argparse.Options{
		Required: false,
		Help:     "Path to user file directory",
		Default:  "/var/data/transient",
	})

	dbPath := parser.String("d", "database", &argparse.Options{
		Required: false,
		Help:     "Path to database file",
		Default:  "./bolt.db",
	})

	// Parse arguments
	if err := parser.Parse(os.Args); err != nil {
		log.Printf("Unexpected error parsing arguments: %v\n", err)
	}

	// Create data dir if not exists
	err := os.MkdirAll(*filePath, 0744)
	if err != nil {
		if *verbose {
			log.Printf("Failed to create data directory: %v\n", err)
		}
		os.Exit(1)
	}

	// Open database
	db, err := bolt.Open(*dbPath, 0744, nil)
	if err != nil {
		if *verbose {
			log.Printf("Failed to open database file: %v\n", err)
		}
		os.Exit(1)
	}

	if *verbose {
		log.Println("Opened database")
	}

	port, ok := os.LookupEnv("PORT")
	if !ok {
		port = "8080"
	}
	// Setup server
	srv := setup(db, filePath, port, verbose)

	// Launch server
	launch(&srv, verbose)

	// Setup shutdown context
	ctx, cancel := context.WithTimeout(context.Background(), time.Duration(10)*time.Second)
	defer cancel()

	// Shutdown server
	shutdown(&srv, ctx, verbose)

	os.Exit(0)
}
