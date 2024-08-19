
import info from './information.json' assert { type: 'json' };

function containsWord(str, word) {
    // Create a regular expression to match the word as a whole word
    const regex = new RegExp(`\\b${word}\\b`, 'i'); // 'i' for case-insensitive match

    // Test if the word is found in the string
    return regex.test(str);
}



export async function fillingInputs(page, ques, inps) {
    const keys = Object.keys(info)
    let flag = true
    for (const key of keys) {
        if (containsWord(ques, key)) {
            await page.locator(inps).fill(info[key])
            await page.keyboard.press('Enter')
            flag = false
            break;
        }
    }
    if(flag)
    {
        await page.locator(inps).fill('0')
        await page.keyboard.press('Enter')
    }
}