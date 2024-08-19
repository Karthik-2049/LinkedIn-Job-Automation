import puppeteer from 'puppeteer';
// Or import puppeteer from 'puppeteer-core';

import { listOfJobs } from './listOfJobs.mjs';
import info from './information.json' assert { type: 'json' };
import { labelsAndInputs } from './labelsAndInputs.mjs';
import { fillingInputs } from './toFillInputs.mjs';
import path from 'path'



// Launch the browser and open a new blank page
const browser = await puppeteer.launch({headless : false});
const page = await browser.newPage();
const dir = "./Job_screenshots"

await page.setViewport({width:1500, height : 800})
await page.goto("https://www.linkedin.com/login?fromSignIn=true&trk=guest_homepage-basic_nav-header-signin")
await page.locator('#username').fill(info['username']) // Username or Email
await page.locator('#password').fill(info['password']) // Password
await page.locator(".btn__primary--large.from__button--floating").click()
await page.waitForSelector('.global-nav')
await page.locator("span[title = 'Jobs']").click()
await page.locator('input[aria-label="Search by title, skill, or company"]').fill(info["jobrole"]) //Role
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



const jobList = await listOfJobs(page)
// console.log(jobList) //ids of list of jobs



page.setDefaultTimeout(3000)
for(let j = 0;j<6;j++)
{
    const targetElement = await page.$(jobList[j]);
    await targetElement.scrollIntoView()
    await new Promise(resolve => setTimeout(resolve, 1000)); 
    await page.locator(jobList[j]).click()
    await new Promise(resolve => setTimeout(resolve, 3000));

    let toContinue = false
    await page.locator('.jobs-apply-button').click().catch(() => {toContinue = true})
    let isNextStep = true
    if(toContinue)
    {
        continue;
    }
    // To skip first two nexts
    await page.locator('button[aria-label = "Continue to next step"]').click()
    await page.locator('button[aria-label = "Continue to next step"]').click().catch(() =>
    {
        isNextStep = false;
    })

    //This while loop is to click as many times NEXT button appears

    while(isNextStep)
    {
        let optionsToFill = await labelsAndInputs(page)
        let ques = optionsToFill[0]
        let inps = optionsToFill[1]
        
        console.log(optionsToFill)

        for(let i = 0;i<inps.length;i++)
        {
            if(inps[i][1]=='u')
            {
                await page.locator('label[data-test-text-selectable-option__label="Yes"]').click().catch(()=>null)
            }
            if(inps[i][1]=='t')
            {
                await page.locator(inps[i]).click();
                await page.keyboard.press('ArrowDown')
                await page.keyboard.press('Enter')
            }
            else
            {
                await fillingInputs(page,ques[i],inps[i])
                await new Promise(resolve => setTimeout(resolve, 800));
            } 
        }


        await new Promise(resolve => setTimeout(resolve, 2000));
        await page.locator('button[aria-label = "Continue to next step"]').click().catch(()=>{
            isNextStep = false
        })
    }

    console.log("While Loop Executed")
    await page.locator('[aria-label = "Review your application"]').click() // Clicking Review your application Button
    
    await new Promise(resolve => setTimeout(resolve, 2000)); // To check your Application

    // To screenshot your applications
    // const Additional_ques = await page.$('[aria-label = "Submit application"]');
    // await Additional_ques.scrollIntoView()
    // let filePath = path.join(dir,`JOB_${j}.png`)
    // await page.screenshot({path : filePath, fullPage:true}) 
    await page.locator('[aria-label = "Submit application"]').click()
    
    await new Promise(resolve => setTimeout(resolve, 2000)); 
    await page.keyboard.press('Escape')
    await new Promise(resolve => setTimeout(resolve, 2000)); 
     
}

// await new Promise(resolve => setTimeout(resolve, 1000000)); 
await browser.close();
