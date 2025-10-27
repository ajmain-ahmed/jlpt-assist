import { Quicksand } from 'next/font/google'
import MuiThemeProvider from './MuiThemeProvider';
import { readFile } from 'fs/promises';
import path from 'path';
import { VocabDataProvider } from './VocabDataProvider';

const quicksand = Quicksand({
  subsets: ['latin'],
})

export const metadata = {
  title: "JLPT Assist",
  description: "Let Japanese take you further",
};

export default async function RootLayout({ children }) {

  const fileCount = {
    'n1': 172,
    'n2': 91,
    'n3': 89,
    'n4': 29,
    'n5': 33,
  }

  const allData = {}

  await Promise.all(
    Object.keys(fileCount).map(async n => {
      const nLength = fileCount[n]
      const pagePromises = []
      for (let index = 1; index <= nLength; index++) {
        const filePath = path.join(process.cwd(), 'public', 'vocab', `${n}`, `${n}_page${index}_v1.json`)
        const data = readFile(filePath, 'utf-8').then(res => JSON.parse(res))
        pagePromises.push(data)
      }
      const resolved = await Promise.all(pagePromises)
      const flatResolved = resolved.flatMap(x => x)
      allData[n] = flatResolved
    })
  )

  return (

    < html lang="en" className={quicksand.className} >
      <body>
        <VocabDataProvider initialVocab={allData}>
          <MuiThemeProvider>
            {children}
          </MuiThemeProvider>
        </VocabDataProvider>
      </body>
    </html >

  )
}
