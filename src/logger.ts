import * as vscode from "vscode";

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

class Logger {
  private outputChannel: vscode.OutputChannel;
  private logLevel: LogLevel;

  constructor(channelName: string, level: LogLevel = LogLevel.INFO) {
    this.outputChannel = vscode.window.createOutputChannel(channelName);
    this.logLevel = level;
  }

  private formatMessage(level: LogLevel, message: string): string {
    const timestamp = new Date().toISOString();
    const levelStr = LogLevel[level].padEnd(5);
    return `[${timestamp}] ${levelStr} - ${message}`;
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.logLevel;
  }

  private log(level: LogLevel, message: string, notify: boolean = false) {
    if (!this.shouldLog(level)) return;

    const formattedMessage = this.formatMessage(level, message);
    console.log(formattedMessage);
    this.outputChannel.appendLine(formattedMessage);

    if (notify) {
      switch (level) {
        case LogLevel.ERROR:
          vscode.window.showErrorMessage(message);
          break;
        case LogLevel.WARN:
          vscode.window.showWarningMessage(message);
          break;
        case LogLevel.INFO:
          vscode.window.showInformationMessage(message);
          break;
      }
    }
  }

  debug(message: string) {
    this.log(LogLevel.DEBUG, message);
  }

  info(message: string, notify: boolean = false) {
    this.log(LogLevel.INFO, message, notify);
  }

  warn(message: string, notify: boolean = true) {
    this.log(LogLevel.WARN, message, notify);
  }

  error(message: string, notify: boolean = true) {
    this.log(LogLevel.ERROR, message, notify);
  }

  setLevel(level: LogLevel) {
    this.logLevel = level;
  }

  dispose() {
    this.outputChannel.dispose();
  }
}

export const logger = new Logger("vsc-mcp", LogLevel.DEBUG);
