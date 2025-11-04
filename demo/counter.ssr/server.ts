/* IMPORT */
// Import polyfills first
import './happy-dom-polyfills.ts'
import { createServer } from 'http'
import renderApp from './index.js'

/* MAIN */

const server = createServer(async (req, res) => {
    try {
        // Render the app
        const html = await renderApp()

        // Send the response
        res.writeHead(200, { 'Content-Type': 'text/html' })
        res.end(`
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>SSR Counter</title>
</head>
<body>
    <div id="app">${html}</div>
    <!-- Client-side hydration script would go here -->
    <script>
      // Hydration logic would go here in a full implementation
      console.log('SSR Counter loaded')
    </script>
</body>
</html>
    `)
    } catch (error) {
        console.error(error)
        res.writeHead(500, { 'Content-Type': 'text/plain' })
        res.end('Internal Server Error')
    }
})

const PORT = process.env.PORT || 3000

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})