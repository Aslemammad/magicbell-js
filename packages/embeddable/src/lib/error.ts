/* eslint-disable @typescript-eslint/ban-ts-comment */
import axios from 'axios';
import * as ErrorStackParser from 'error-stack-parser';
import { ErrorInfo } from 'react';

/**
 * Report an error to rollbar.
 *
 * @param error
 * @param errorInfo
 * @param userId
 * @param apiKey
 */
export function reportError(
  error: Error,
  errorInfo: ErrorInfo,
  { userId, ...context }: { userId: string; apiKey: string },
) {
  const stack = [
    ...ErrorStackParser.parse(new Error(errorInfo.componentStack)),
    ...ErrorStackParser.parse(error),
  ].reverse();

  const data = {
    environment: process.env.NODE_ENV,
    title: error.toString(),
    client: {
      javascript: {
        browser: navigator.userAgent,
      },
    },
    person: { id: userId },
    custom: context,
    framework: 'react',
    language: 'javascript',
    platform: 'browser',
    body: {
      trace: {
        frames: stack.map((frame) => ({
          filename: frame.fileName,
          lineno: frame.lineNumber,
          colno: frame.columnNumber,
          method: frame.functionName,
          code: frame.source,
        })),
        exception: {
          class: error.name,
          message: error.message,
        },
      },
    },
  };

  axios.post(
    'https://api.rollbar.com/api/1/item/',
    { data },
    { headers: { 'X-Rollbar-Access-Token': 'b009260297fe434b993ffd309bd6bca2' } },
  );
}
