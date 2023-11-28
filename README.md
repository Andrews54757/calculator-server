# General Purpose Small Calculations Server

A simple API server that does small calculations and returns the result.

## Why?

Designed for extensions which need to run small pieces of code. Google currently prohibits Manifest V3 extensions from running any "remote code" even if it is sandboxed with a restricted interpreter. 

```
Extensions using Manifest V3 must meet additional requirements related to the extension's code. Specifically, the full functionality of an extension must be easily discernible from its submitted code. This means that the logic of how each extension operates should be self contained. The extension may reference and load data and other information sources that are external to the extension, but these external resources must not contain any logic. Some common violations include:

- Including a <script> tag that points to a resource that is not within the extension's package

- Using JavaScript's eval() method or other mechanisms to execute a string fetched from a remote source

- Building an interpreter to run complex commands fetched from a remote source, even if those commands are fetched as data
```

This backend allows you to run small scripts on a server and get the results.

## Usage

> npm install
> npm run start

## Privacy
No data is collected, no logging enabled by default.