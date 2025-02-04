export const INITIAL_PAGE_CONTENT = {
    title: '',
    slug: '',
    content:
        `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Document</title>
<style>
    h1 {
        color: red;
    }
</style>
</head>
<body>
    <h1>Hello, World!</h1>
</body>
</html>`
}

export const PageService = [
    {
        key: "blockchain",
        title: "Blockchain"
    },
    {
        key: "ai",
        title: "AI"
    },
    {
        key: "gaming",
        title: "Gaming"
    },
    {
        key: "consulting",
        title: "Consulting"
    },
    {
        key: "industries",
        title: "Industries"
    },
]

export const PageSubService = {
    blockchain: [
        {
            key: 'core_blockchain',
            title: 'Core Blockchain',
        },
        {
            key: 'crypto',
            title: "Crypto"
        },
        {
            key: 'dapps',
            title: "Dapps"
        }
    ],
    ai:[
        {
            key: 'ai_solutions',
            title: "AI Solutions"
        },
        {
            key: 'robotics',
            title: "Robotics"
        }
    ],
    gaming: [
        {
            key: 'gaming_tech',
            title: "Gaming Tech"
        },
        {
            key: 'esports',
            title: "Esports"
        }
    ],
    consulting: [
        {
            key: 'consulting',
            title: 'Consulting'
        },
    ],
    industries: [
        {
            key: 'industries',
            title: "Industries"
        }
    ]

}