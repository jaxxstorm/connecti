package name

import (
	"github.com/cip8/autoname"
	"math/rand"
	"time"
)

func Generate() string {
	// generate some entropy
	rand.Seed(time.Now().UTC().UnixNano())
	return autoname.Generate("-")
}