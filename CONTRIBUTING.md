# Contributing

Keep changes small, useful, and understandable. Describe the problem and expected behavior in an issue or pull request. Add a regression test for changes to tool behavior.

Run `npm run check` and `npm test` before submitting. Check keyboard use and narrow screens for UI changes. Preserve the no-upload design: tools should work entirely in the browser and avoid analytics or third-party runtime requests.

Source modules use native ES modules and Node's built-in test runner. There is no dependency install step. Keep generated files and local browser state out of commits.
