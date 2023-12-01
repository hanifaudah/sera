import assert from 'node:assert'
import { createEmailTemplate, deleteEmailTemplate, listEmailTemplates, retrieveEmailTemplate, updateEmailTemplate, validateSlug } from '../../src/service/emailTemplate'
import { StandardError } from '../../src/util/error'

describe('the tests are working', function () {
  it('should pass', () => {
    assert.equal(1 + 2, 3)
  })
})

const beforeFunction = function () {
  return (async () => {
    const slugs = ['a-1', 'a-2', 'a-3']
    const emailTemplates = await listEmailTemplates()
    for (const emailTemplate of emailTemplates) {
      if (slugs.includes(emailTemplate.slug)) {
        try {
          await deleteEmailTemplate(emailTemplate.id)
        } catch (error) {
          //
        }
      }
    }
  })()
}

describe('testing validateSlug service', function () {
  before(beforeFunction)

  it('should not throw error', async () => {
    return (async () => {
      assert.doesNotThrow(async () => await validateSlug('a-b'))
    })()
  })

  it('should throw error', async () => {
    return (async () => {
      const error = new StandardError('Invalid slug format, follow this pattern: /^[a-z0-9-]+[a-z0-9]+$/', { status: 400 })
      assert.rejects(async () => await validateSlug('a b'), error as Error)
    })()
  })
})

describe('testing listEmailTemplates service', function () {
  before(beforeFunction)

  it('should return array', async () => {
    return (async () => {
      const emailTemplates = await listEmailTemplates()
      assert.equal(Array.isArray(emailTemplates), true)
    })()
  })
})

describe('testing createEmailTemplate service', function () {
  before(beforeFunction)

  const error = new StandardError('Slug already exists', { status: 400 })
  it('should throw error', async () => {
    return (async () => {
      await createEmailTemplate({
        slug: 'a-1',
        template: 'hello'
      })
      assert.rejects(
        async () => await createEmailTemplate({
          slug: 'a-1',
          template: 'hello'
        }),
        error as Error
      )
    })()
  })
})

describe('testing retrieveEmailTemplate service', function () {
  before(beforeFunction)

  it('should not throw error', async () => {
    return (async () => {
      const existingEmail = await createEmailTemplate({
        slug: 'a-1',
        template: 'hello'
      })
      assert.doesNotThrow(async () => await retrieveEmailTemplate(existingEmail.id))
    })()
  })
})

describe('testing deleteEmailTemplate service', function () {
  before(beforeFunction)

  it('should not throw error', async () => {
    return (async () => {
      const existingEmail = await createEmailTemplate({
        slug: 'a-1',
        template: 'hello'
      })
      assert.doesNotThrow(async () => await deleteEmailTemplate(existingEmail.id))
    })()
  })
})

describe('testing updateEmailTemplate service', function () {
  before(beforeFunction)

  it('should not throw error', async () => {
    return (async () => {
      const existingEmail = await createEmailTemplate({
        slug: 'a-1',
        template: 'hello'
      })
      assert.doesNotThrow(async () => await updateEmailTemplate(
        existingEmail.id,
        {
          slug: 'a-2'
        }
      ))
    })()
  })

  it('should throw error', async () => {
    return (async () => {
      const existingEmail = await createEmailTemplate({
        slug: 'a-2',
        template: 'hello'
      })
      await createEmailTemplate({
        slug: 'a-3',
        template: 'hello'
      })
      const error = new StandardError('Slug already exists', { status: 400 })
      assert.rejects(
        async () => await updateEmailTemplate(
          existingEmail.id,
          {
            slug: 'a-3',
            template: 'hello'
          }
        ),
        error as Error
      )
    })()
  })
})