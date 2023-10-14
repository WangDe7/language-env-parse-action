import * as core from '@actions/core'
import * as fs from 'fs'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const serviceJsonStr = core.getInput('serviceJsonStr')
    const serviceJsonFilePath = core.getInput('serviceJsonFilePath')
    const languageTypeField = core.getInput('languageTypeField')
    const languageVersionField = core.getInput('languageVersionField')

    // Get service information
    let serviceJsonStrNew = serviceJsonStr
    if (serviceJsonStrNew === '') {
      serviceJsonStrNew = fs.readFileSync(serviceJsonFilePath, 'utf-8')
    }
    console.log('----get the service information----')
    console.log(serviceJsonStrNew)

    const serviceObject = JSON.parse(serviceJsonStrNew)
    const languageEnvArray: string[] = []
    // Extract language version information from service
    for (const index in serviceObject) {
      let languageType = serviceObject[index][languageTypeField]
      let languageVersion = serviceObject[index][languageVersionField]
      if (languageType === undefined) {
        languageType = ''
      }
      if (languageVersion === undefined) {
        languageVersion = ''
      }
      const languageStr = languageType.concat('/', languageVersion)
      languageEnvArray.push(languageStr)
    }

    // Array deduplication
    const result = Array.from(new Set(languageEnvArray))
    console.log('----get the language env information----')
    console.log(result)

    // Set outputs for other workflow steps to use
    core.setOutput('languageEnv', result)
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) {
      core.setFailed(error.message)
    } else {
      core.setFailed('An error occurred while parsing the locale')
    }
  }
}
