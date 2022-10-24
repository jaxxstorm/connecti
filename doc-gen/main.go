package main

import (
	"fmt"
	"os"
	"strings"

	"github.com/jaxxstorm/connecti/cmd/cli"
	"github.com/spf13/cobra/doc"
)

func appendToFile(name string) string {
	return ""
}

func handleLink(str string) string {
	name := strings.ReplaceAll(strings.ReplaceAll(strings.Split(str, ".")[0], "connecti_", ""), "_", "-")
	return fmt.Sprintf("/docs/%s", name)
}

func main() {
	rootCommand := cli.ConfigureCLI()
	err := doc.GenMarkdownTreeCustom(rootCommand, "./docs-output", appendToFile, handleLink)
	if err != nil {
		fmt.Printf("Error: %v", err)
		os.Exit(1)
	}
}
