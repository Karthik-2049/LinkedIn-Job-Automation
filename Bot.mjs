import puppeteer from 'puppeteer';
// Or import puppeteer from 'puppeteer-core';

// Launch the browser and open a new blank page



const browser = await puppeteer.launch({headless : false});
const page = await browser.newPage();



await page.setViewport({width:1500, height : 1080})
await page.goto("https://www.linkedin.com/login?fromSignIn=true&trk=guest_homepage-basic_nav-header-signin")
await page.locator('#username').fill('*****') // Username or Email
await page.locator('#password').fill('*****') // Password
await page.locator(".btn__primary--large.from__button--floating").click()

await page.waitForSelector('.global-nav')
await page.locator("span[title = 'Jobs']").click()
await page.locator('input[aria-label="Search by title, skill, or company"]').fill("Machine Learning engineer") //Role
await page.keyboard.press('Enter')
await new Promise(resolve => setTimeout(resolve, 3000)); 

const checked = await page.evaluate(() => {
    let easyapplyButton = document.querySelector('button[aria-label="Easy Apply filter."]')
    const isChecked = easyapplyButton.getAttribute('aria-checked')==='false';
    return isChecked
})
if(checked)
{
    await page.locator('button[aria-label="Easy Apply filter."]').click()
}
await new Promise(resolve => setTimeout(resolve, 3000)); 

const jobList = await page.evaluate(()=>
{
    const searchResults = document.querySelector('.jobs-search-results-list')
    const ul_elem = searchResults.querySelector('ul')
    const li_elem = ul_elem.querySelectorAll('li')
    let result = Array.from(li_elem).map(li => `#${li.getAttribute('id')}`)
    return result;
})

let final_arr = []
for(let x = 1;x<jobList.length;x++)
{
    if(jobList[x]!=='#null')
    {
        final_arr.push(jobList[x])
    }
}
console.log(final_arr)

page.setDefaultTimeout(3000)
for(let j = 1;j<6;j++)
{
    await page.locator('.jobs-apply-button').click()
    let isNextStep = true
    
    // To skip first two nexts
    await page.locator('button[aria-label = "Continue to next step"]').click()
    await page.locator('button[aria-label = "Continue to next step"]').click().catch(() =>
    {
        isNextStep = false;
    })
    //This while loop is to click as many times NEXT button appears

    while(isNextStep)
    {
        let fillOptions = await page.evaluate(() => {
            let questionsBlock = document.querySelector('.pb4');
            if (questionsBlock) {
                let questions = questionsBlock.querySelectorAll('label');
                let quesArr =  Array.from(questions).map(label => label.innerText); 
                let numInputs = questionsBlock.querySelectorAll('input');
                let inputArr = Array.from(numInputs).map(input => `#${input.getAttribute('id')}`);
                return [quesArr,inputArr]
            }
            return [];
        })

        let selectOptions = await page.evaluate(() => 
        {
            let questionsBlock = document.querySelector('.pb4');
            if(questionsBlock)
            {
                let select = questionsBlock.querySelectorAll('select')
                let selectArr = Array.from(select).map(s => `#${s.getAttribute('id')}`)
                return selectArr
            };
            return [];
        })
        let ques = fillOptions[0]
        let inps = fillOptions[1]
        console.log(fillOptions)
        for(let i = 0;i<inps.length;i++)
        {
            if(inps[i][1]=='u')
            {
                await page.locator('label[data-test-text-selectable-option__label="Yes"]').click().catch(()=>null)
            }
            else
            {
                if(ques[i].toLowerCase().includes('ctc'))
                {
                    await page.locator(inps[i]).fill('1800000')
                }
                if(ques[i].toLowerCase().includes('salary'))
                {
                    await page.locator(inps[i]).fill('1400000')
                }
                else{
                    await page.locator(inps[i]).fill('0')
                }
            } 
        }
        for(let i = 0;i<selectOptions.length;i++)
        {
            await page.locator(selectOptions[i]).click();
            // await page.locator(selectOptions[i]+' option[value = "Yes"]').click()
            await page.keyboard.press('ArrowDown')
            await page.keyboard.press('Enter')
        }

        await page.locator('button[aria-label = "Continue to next step"]').click().catch(()=>{
            isNextStep = false
        })
    }

    console.log("While Loop Executed")
    await page.locator('[aria-label = "Review your application"]').click() // Clicking Review you application Button
    await new Promise(resolve => setTimeout(resolve, 6000)); // To check your Application
    await page.locator('[aria-label = "Submit application"]').click()
    await new Promise(resolve => setTimeout(resolve, 2000)); 
    await page.keyboard.press('Escape')
    await new Promise(resolve => setTimeout(resolve, 2000)); 
    const targetElement = await page.$(final_arr[j]);
    await targetElement.scrollIntoView()
    await new Promise(resolve => setTimeout(resolve, 1000)); 
    await page.locator(final_arr[j]).click()
    await new Promise(resolve => setTimeout(resolve, 1000)); 
}



await new Promise(resolve => setTimeout(resolve, 1000000)); 
await browser.close();
