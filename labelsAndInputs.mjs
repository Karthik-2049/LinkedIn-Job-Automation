



export async function labelsAndInputs(page)
{

    let optionsToFill = await page.evaluate(() => {
        let questionsBlock = document.querySelector('.pb4');
        if (questionsBlock) {
            let blocks = questionsBlock.querySelectorAll('.jobs-easy-apply-form-section__grouping');
            if (blocks)
            {
                let labels = []
                let inputAndSelectId = []
                for(let i = 0;i<blocks.length;i++)
                {
                    let label = blocks[i].querySelector('label')
                    labels.push(label ? label.innerText : '')
                    let input = blocks[i].querySelector('input')
                    if(!input)
                    {
                        input = blocks[i].querySelector('select')
                    }
                    inputAndSelectId.push(`#${input.getAttribute('id')}`)
                }
                return [labels,inputAndSelectId]
            }
            return [[],[]]
        }
        return [[],[]];
    })
    return optionsToFill
}