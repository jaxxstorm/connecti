package terminal

import (
	"strings"
)

type PulumiOutputProgressHandler func(progress int, msg string)

type PulumiOutput struct {
	Type            string
	CurrentProgress int
	Handler         PulumiOutputProgressHandler
}

func (i *PulumiOutput) HandleUpdate(urn, status string) {
	if i.CurrentProgress == 0 && urn == "pulumi:pulumi:Stack" {
		i.CurrentProgress = 20
		msg := "Creating resources..."
		i.Handler(20, msg)
	} else if urn == "pulumi:pulumi:Stack" && status == "created" {
		i.CurrentProgress = 80
		msg := "Resources created. Finishing up..."
		i.Handler(80, msg)
	} else if status == "created" {
		i.CurrentProgress = i.CurrentProgress + 5
		i.Handler(i.CurrentProgress, "")
	}
}

func (i *PulumiOutput) HandleDestroy(urn, status string) {
	if i.CurrentProgress == 0 {
		i.CurrentProgress = 20
		msg := "Destroying resources..."
		i.Handler(20, msg)
	} else if status == "deleted" {
		i.CurrentProgress = i.CurrentProgress + 5
		i.Handler(i.CurrentProgress, "")
	}
}

func (i *PulumiOutput) Write(msg []byte) (int, error) {
	msgParts := strings.Split(string(msg), " ")

	if len(msgParts) == 7 {
		urn := msgParts[3]
		status := msgParts[5]

		switch i.Type {
		case "update":
			i.HandleUpdate(urn, status)
		case "destroy":
			i.HandleDestroy(urn, status)
		}

		return len(msg), nil
	}

	return len(msg), nil
}
