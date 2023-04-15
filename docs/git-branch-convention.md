# **Git Branching Naming Convention**

## **Branch name rules:**

- **Format**:

  > **{Type}**/**{sprint-\*\*}**\_message_in_line

- **Params**:

  - **Type**:
    - `ci`
    - `feature`
    - `fix`
    - `hotfix`
    - `refactor`
    - `revert`
  - **sprint-\*\***: sprint version.

- Ex: `feature/sprint-1_user_create_readme`

## **Main branches:**

- **feature/sprint-\*\***: develop
- **develop**: staging
- **main**: production

## **Commit rules:**

- **Format:**

  > **{Type}**: message.

- **Params**:
  - **Type**:
    - `ci`
    - `feat`
    - `fix`
    - `refactor`
    - `revert`
- Ex:
  - `feat: create readme.`

## **Pull request rules:**

- **Format:**

  > **{Type}/Sprint {X}** - Message.

- **Params**:
  - **Type**:
    - `CI`
    - `Feature`
    - `Fix`
    - `Refactor`
    - `Revert`
  - **X**: sprint number
- Ex:
  - `Feature/Sprint 1 - Create readme.`

# Git Flow

<img src="https://wac-cdn.atlassian.com/dam/jcr:cc0b526e-adb7-4d45-874e-9bcea9898b4a/04%20Hotfix%20branches.svg?cdnVersion=456" alt="drawing" style="width:500px;"/>
