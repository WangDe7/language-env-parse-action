/**
 * Unit tests for the action's main functionality, src/main.ts
 *
 * These should be run as if the action was called from a workflow.
 * Specifically, the inputs listed in `action.yml` should be set as environment
 * variables following the pattern `INPUT_<INPUT_NAME>`.
 */

import * as core from '@actions/core'
import * as main from '../src/main'

// Mock the GitHub Actions core library
const debugMock = jest.spyOn(core, 'debug')
const getInputMock = jest.spyOn(core, 'getInput')
const setFailedMock = jest.spyOn(core, 'setFailed')
const setOutputMock = jest.spyOn(core, 'setOutput')

// Mock the action's main function
const runMock = jest.spyOn(main, 'run')

// Other utilities
const timeRegex = /^\d{2}:\d{2}:\d{2}/

describe('action', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('sets the output', async () => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation((name: string): string => {
      switch (name) {
        case 'serviceJsonStr':
          return '[{"name":"matrix-cloud-blockchain-syncer","type":"service","language":["java"],"languageEnvType":"java","languageEnvVersion":"11","report":"","projectPath":["matrix-cloud-blockchain-syncer"],"_":null,"coverage":0},{"name":"matrix-cloud-flow-service-grpc","type":"library","language":["golang"],"languageEnvType":"golang","languageEnvVersion":"1.20","report":"","projectPath":["matrix-cloud-flow-service-grpc"],"_":null,"coverage":0}]'
        case 'serviceJsonFilePath':
          return 'service.json'
        case 'languageTypeField':
          return 'languageEnvType'
        case 'languageEnvVersion':
          return 'languageEnvVersion'
        default:
          return ''
      }
    })

    await main.run()
    expect(runMock).toHaveReturned()

    // Verify that all of the core library functions were called correctly
    // expect(debugMock).toHaveBeenNthCalledWith(1, 'Waiting 500 milliseconds ...')
    // expect(debugMock).toHaveBeenNthCalledWith(
    //   2,
    //   expect.stringMatching(timeRegex)
    // )
    // expect(debugMock).toHaveBeenNthCalledWith(
    //   3,
    //   expect.stringMatching(timeRegex)
    // )
    expect(setOutputMock).toHaveBeenNthCalledWith(1, 'languageEnv', [
      'java/11',
      'golang/1.20'
    ])
  })

  it('sets a failed status', async () => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation((name: string): string => {
      switch (name) {
        case 'serviceJsonFilePath':
          return 'fakeService.json'
        case 'languageTypeField':
          return 'languageEnvType'
        case 'languageEnvVersion':
          return 'languageEnvVersion'
        default:
          return ''
      }
    })

    await main.run()
    expect(runMock).toHaveReturned()

    // Verify that all of the core library functions were called correctly
    expect(setFailedMock).toHaveBeenNthCalledWith(
      1,
      'milliseconds not a number'
    )
  })
})
