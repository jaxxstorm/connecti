package main

import (
	"fmt"
	"os"
	"strings"

	"github.com/jaxxstorm/connecti/cmd/cli"
	"github.com/spf13/cobra/doc"
	"golang.org/x/text/cases"
	"golang.org/x/text/language"
)

// website/content/docs/connecti_connect_aws.md

func parseFileName(str string) string {
	parts := strings.Split(str, "/")
	rawName := strings.Split(parts[len(parts)-1], ".")[0]
	rawNameParts := strings.Split(rawName, "_")

	var finalParts []string
	for _, p := range rawNameParts {
		if len(rawNameParts) > 1 && p == "connecti" {
			continue
		}

		c := cases.Title(language.English)
		finalParts = append(finalParts, c.String(p))
	}

	return strings.Join(finalParts, " ")
}

func createMetaDescription(name string) string {
	descPattern := "Learn how to use the %s command to help you create, manage, and destroy private subnet connections."
	return fmt.Sprintf(descPattern, name)
}

func appendToFile(name string) string {
	title := parseFileName(name)
	desc := createMetaDescription(title)

	return fmt.Sprintf("---\ntitle: %s\ndescription: %s\n---\n", title, desc)
}

func handleLink(str string) string {
	name := strings.ReplaceAll(strings.ReplaceAll(strings.Split(str, ".")[0], "connecti_", ""), "_", "-")
	return fmt.Sprintf("/docs/%s", name)
}

func main() {
	rootCommand := cli.ConfigureCLI()
	err := doc.GenMarkdownTreeCustom(rootCommand, "./website/content/docs", appendToFile, handleLink)
	if err != nil {
		fmt.Printf("Error: %v", err)
		os.Exit(1)
	}
}
