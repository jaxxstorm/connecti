package terminal

import (
	"os"
	"strings"
	"time"

	"github.com/charmbracelet/bubbles/progress"
	tea "github.com/charmbracelet/bubbletea"
)

type PulumiOutput struct {
	Type            string
	CurrentProgress int
	ProgressBar     *ProgressBar
}

func (i *PulumiOutput) HandleUpdate(urn, status string) {
	if i.CurrentProgress == 0 && urn == "pulumi:pulumi:Stack" {
		i.CurrentProgress = 20
		i.ProgressBar.SetProgress(20)
	} else if urn == "pulumi:pulumi:Stack" && status == "created" {
		i.CurrentProgress = 80
		i.ProgressBar.SetProgress(80)
	} else if status == "created" {
		i.CurrentProgress = i.CurrentProgress + 5
		i.ProgressBar.SetProgress(i.CurrentProgress)
	}
}

func (i *PulumiOutput) HandleDestroy(urn, status string) {
	if i.CurrentProgress == 0 {
		i.CurrentProgress = 20
		i.ProgressBar.SetProgress(20)
	} else if status == "deleted" {
		i.CurrentProgress = i.CurrentProgress + 5
		i.ProgressBar.SetProgress(i.CurrentProgress)
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

type progressBarFinished chan bool
type completeProgressBar chan bool
type closeProgressBar int

type ProgressBar struct {
	Value   int
	element *tea.Program
}

type ProgressBarMessage struct {
	Value int
}

func (p *ProgressBar) SetProgress(value int) {
	p.Value = value
	p.element.Send(ProgressBarMessage{
		Value: value,
	})
}

func (p *ProgressBar) Done() {
	pbFlag := make(chan bool)
	p.element.Send(progressBarFinished(pbFlag))

	<-pbFlag

	// Make the finish less abrupt.
	time.Sleep(time.Millisecond * 500)
	p.element.Send(closeProgressBar(1))
	time.Sleep(time.Millisecond * 500)
}

type programCreationResult struct {
	program *tea.Program
	err     error
}

type ProgressBarArgs struct {
	Padding  int
	MaxWidth int
}

func NewProgressBar(args ProgressBarArgs) (*ProgressBar, error) {
	if args.Padding == 0 {
		args.Padding = 2
	}

	if args.MaxWidth == 0 {
		args.MaxWidth = 80
	}

	program := make(chan programCreationResult)
	go func() {
		element := progressBarElement{
			padding:  args.Padding,
			maxWidth: args.MaxWidth,
			progress: progress.New(progress.WithDefaultGradient()),
			value:    0,
		}

		p := tea.NewProgram(element)
		program <- programCreationResult{
			program: p,
		}

		err := p.Start()
		program <- programCreationResult{
			program: p,
			err:     err,
		}
	}()

	programResult := <-program
	if programResult.err != nil {
		return nil, programResult.err
	}

	pb := &ProgressBar{
		Value:   0,
		element: programResult.program,
	}

	return pb, nil
}

type progressBarElement struct {
	progress progress.Model
	padding  int
	maxWidth int
	value    int
}

func (p progressBarElement) Init() tea.Cmd {
	return p.progress.SetPercent(0)
}

func (e progressBarElement) View() string {
	pad := strings.Repeat(" ", e.padding)

	return "\n" +
		pad + e.progress.View() + "\n" +
		pad + "Press any ctr+c to quit"
}

func (m progressBarElement) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	switch msg := msg.(type) {
	case tea.KeyMsg:
		if tea.KeyCtrlC.String() == msg.String() {
			tea.Quit()
			os.Exit(1)
		}
	case tea.WindowSizeMsg:
		m.progress.Width = msg.Width - m.padding*2 - 4
		if m.progress.Width > m.maxWidth {
			m.progress.Width = m.maxWidth
		}
		return m, nil

	case ProgressBarMessage:
		m.value = msg.Value
		pct := float64(m.value) / float64(100)
		cmd := m.progress.SetPercent(pct)
		return m, cmd

	case progressBarFinished:
		cmd := m.progress.SetPercent(1)
		return m, tea.Batch(closeProgressBarListener(msg), cmd)

	case completeProgressBar:
		if m.progress.Percent() == 1.0 {
			msg <- true
		}

		return m, nil

	case closeProgressBar:
		return m, tea.Quit

	case progress.FrameMsg:
		progressModel, cmd := m.progress.Update(msg)
		m.progress = progressModel.(progress.Model)
		return m, cmd
	}

	return m, nil
}

func closeProgressBarListener(pbFlag chan bool) tea.Cmd {
	return tea.Tick(time.Millisecond*250, func(t time.Time) tea.Msg {
		return completeProgressBar(pbFlag)
	})
}
