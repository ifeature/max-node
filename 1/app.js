'use strict';

const fs = require('fs');
const url = require('url');

function renderHTML(path, response) {
    fs.readFile(path, {encoding: 'utf-8'}, function (error, data) {
        if (error) {
            response.statusCode = 404;
            response.write('404 - Non Found.');
        } else {
            response.write(data);
        }
        response.end();
    });
}

module.exports = {
    handleRequest: function (request, response) {
        response.statusCode = 200;
        response.setHeader('Content-Type', 'text/html');
        const path = url.parse(request.url).pathname;

        switch (path) {
            case '/':
                renderHTML('./index.html', response);
                break;
            case '/login':
                renderHTML('./login.html', response);
                break;
            default:
                response.statusCode = 404;
                response.write('Route not defined.');
                response.end();
        }
    }
};