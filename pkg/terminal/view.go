package terminal

import (
	"strings"
	"time"

	"github.com/charmbracelet/bubbles/progress"
	"github.com/charmbracelet/bubbles/stopwatch"
	tea "github.com/charmbracelet/bubbletea"
	"github.com/spf13/cobra"
)

type CobraCommandHandler func(cmd *cobra.Command, args []string) error
type CLICommandHandler func(cmd *cobra.Command, args []string, view View) error

type progressBarUpdate struct {
	Value int
	Msg   string
}

type cancelPulumiExec func() error
type viewError error
type viewComplete int
type viewExit int

type CLICommand struct {
	handler CLICommandHandler
	cmd     *cobra.Command
	args    []string
}

type View struct {
	OutputHandler PulumiOutput

	cancelPulumiExec         cancelPulumiExec
	cancelPulumiExecListener chan cancelPulumiExec
	pulumiProgressOutput     chan progressBarUpdate
	progress                 progress.Model
	stopwatch                stopwatch.Model
	msg                      string
	command                  CLICommand
	error                    bool
	done                     bool
}

func (v View) handleCommand() tea.Msg {
	err := v.command.handler(v.command.cmd, v.command.args, v)
	if err != nil {
		return viewError(err)
	}

	return viewComplete(1)
}

func (v View) NewPulumiOutputHandler(typ string) *PulumiOutput {
	return &PulumiOutput{
		Type:            typ,
		CurrentProgress: 0,
		Handler:         v.SendPulumiProgressOutput,
	}
}

func (v View) SendPulumiProgressOutput(progress int, msg string) {
	v.pulumiProgressOutput <- progressBarUpdate{
		Value: progress,
		Msg:   msg,
	}
}

func (v View) ListenForPulumiProgressOutput() tea.Msg {
	newProgressValue := <-v.pulumiProgressOutput
	return progressBarUpdate(newProgressValue)
}

func (v View) SetPulumiProgramCancelFn(fn cancelPulumiExec) {
	v.cancelPulumiExecListener <- fn
}

func (v View) ListForPulumiProgramCancelFn() tea.Msg {
	cancelFn := <-v.cancelPulumiExecListener
	close(v.cancelPulumiExecListener)
	return cancelFn
}

func (v View) Init() tea.Cmd {
	return tea.Batch(
		v.progress.SetPercent(0), v.handleCommand, v.stopwatch.Init(),
		v.ListenForPulumiProgressOutput, v.ListForPulumiProgramCancelFn,
	)
}

func (v View) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	switch msg := msg.(type) {
	case cancelPulumiExec:
		v.cancelPulumiExec = msg
		return v, nil
	case tea.KeyMsg:
		if tea.KeyCtrlC.String() == msg.String() {
			if v.cancelPulumiExec == nil {
				v.msg = v.msg + "\n  Cannot cancel pulumi program safely"
				return v, nil
			}

			err := v.cancelPulumiExec()
			if err != nil {
				v.msg = err.Error()
				v.error = true
			}

			return v, tea.Quit
		}
	case tea.WindowSizeMsg:
		v.progress.Width = msg.Width
		if v.progress.Width > 80 {
			v.progress.Width = 80
		}
		return v, nil
	case progress.FrameMsg:
		progressModel, cmd := v.progress.Update(msg)
		v.progress = progressModel.(progress.Model)
		return v, cmd
	case stopwatch.TickMsg, stopwatch.StartStopMsg, stopwatch.ResetMsg:
		stopwatchModel, cmd := v.stopwatch.Update(msg)
		v.stopwatch = stopwatchModel
		return v, cmd
	case progressBarUpdate:
		if msg.Msg != "" {
			v.msg = msg.Msg
		}

		pct := float64(msg.Value) / float64(100)
		cmd := v.progress.SetPercent(pct)
		return v, tea.Batch(cmd, v.ListenForPulumiProgressOutput)
	case viewError:
		v.msg = msg.Error()
		v.error = true
		return v, tea.Quit
	case viewComplete:
		v.msg = "✅ Finished"
		v.done = true
		cmd := v.progress.SetPercent(1)
		return v, tea.Batch(cmd, v.Close())
	case viewExit:
		return v, tea.Quit
	}

	return v, nil
}

func (v View) View() string {
	pad := strings.Repeat(" ", 2)

	if v.error {
		return "Attempted action:\n\n" +
			pad + v.progress.View() + "\n" +
			pad + "Time elapsed: " + v.stopwatch.View() + "\n\n" +
			pad + "Error:\n" +
			pad + pad + v.msg + "\n"
	}

	if v.done {
		return "Performed action:\n\n" +
			pad + v.progress.View() + "\n" +
			pad + "Time elapsed: " + v.stopwatch.View() + "\n" +
			pad + v.msg + "\n"
	}

	return "Performing action:\n\n" +
		pad + v.progress.View() + "\n" +
		pad + "Time elapsed: " + v.stopwatch.View() + "\n" +
		pad + v.msg + "\n"
}

func (v View) Close() tea.Cmd {
	return tea.Tick(time.Millisecond*750, func(t time.Time) tea.Msg {
		return viewExit(1)
	})
}

func WrapCobraCommand(block CLICommandHandler) CobraCommandHandler {
	return func(cmd *cobra.Command, args []string) error {
		view := View{
			cancelPulumiExecListener: make(chan cancelPulumiExec),
			pulumiProgressOutput:     make(chan progressBarUpdate),
			stopwatch:                stopwatch.New(),
			progress:                 progress.New(progress.WithDefaultGradient()),
			command: CLICommand{
				handler: block,
				cmd:     cmd,
				args:    args,
			},
			msg: "Setting up Pulumi action...",
		}

		program := tea.NewProgram(view)
		return program.Start()
	}
}
