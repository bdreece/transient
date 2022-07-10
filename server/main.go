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
	"os"
	"time"

	"github.com/akamensky/argparse"
	"github.com/boltdb/bolt"
)

func main() {
	p := argparse.NewParser("server", "Transient server application")
	verbose := p.Flag("v", "verbose", &argparse.Options{
		Help: "Enable verbose output",
	})

	db, err := bolt.Open("bolt.db", 0666, nil)
	if err != nil {
		os.Exit(1)
	}
	// Setup server
	srv := setup(*verbose, db)

	// Launch server
	launch(&srv, *verbose)

	// Setup shutdown context
	ctx, cancel := context.WithTimeout(context.Background(), time.Duration(10)*time.Second)
	defer cancel()

	// Shutdown server
	shutdown(&srv, ctx, *verbose)

	os.Exit(0)
}
