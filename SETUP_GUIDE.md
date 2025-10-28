# GitHub Repository Setup Guide - Block Select Plugin

This guide will walk you through setting up your GitHub repository with industry best practices.

## 📋 Current Status

Your repository already has a great foundation! Here's what's in place:

✅ **Documentation**
- README.md with comprehensive features and usage
- CONTRIBUTING.md with development guidelines
- LICENSE (MIT)
- Issue templates (bug report, feature request)
- Pull request template

✅ **CI/CD**
- Build workflow (tests on Node 18.x and 20.x)
- Release workflow (automated releases on tag push)
- Version verification

✅ **Configuration**
- .gitignore (comprehensive)
- TypeScript configuration
- Build setup with esbuild

✅ **Funding**
- Buy Me a Coffee integration

## 🚀 Step-by-Step Setup

### 1. Repository Settings on GitHub

#### 1.1 General Settings
1. Go to your repository on GitHub: `https://github.com/GraysonCAdams/block-select`
2. Click **Settings** tab
3. Under **General**:
   - ✅ Repository name: `block-select`
   - ✅ Description: "Smart text selection for Obsidian headers"
   - ✅ Website: Add your documentation URL or leave blank
   - ✅ Topics: Add relevant tags:
     - `obsidian-plugin`
     - `obsidian`
     - `markdown`
     - `text-selection`
     - `productivity`
     - `editor-extension`

#### 1.2 Features
- ✅ Enable **Issues**
- ✅ Enable **Preserve this repository** (optional archiving)
- ✅ Enable **Sponsorships** (shows your funding links)
- ✅ Enable **Discussions** (recommended for community Q&A)
- ❌ Disable **Projects** (unless you plan to use them)
- ❌ Disable **Wiki** (use README/docs instead)

#### 1.3 Pull Requests
- ✅ Enable **Allow squash merging** (recommended)
- ✅ Enable **Allow rebase merging**
- ❌ Disable **Allow merge commits** (keeps history clean)
- ✅ Enable **Automatically delete head branches**

#### 1.4 Branches
1. Set **main** as default branch
2. Add branch protection rules:
   - Go to **Settings** → **Branches** → **Add rule**
   - Branch name pattern: `main`
   - Enable:
     - ✅ Require pull request before merging
     - ✅ Require status checks to pass before merging
       - Add required status checks: `build`, `lint`
     - ✅ Require branches to be up to date before merging
     - ✅ Do not allow bypassing the above settings (recommended)

### 2. Repository Labels

Set up helpful labels for issue management:

**Priority Labels:**
- `priority: critical` (red, #d93f0b)
- `priority: high` (orange, #ff9800)
- `priority: medium` (yellow, #fdd835)
- `priority: low` (green, #4caf50)

**Type Labels:**
- `type: bug` (red, #d73a4a) - Already exists
- `type: feature` (blue, #0075ca) - Already exists
- `type: enhancement` (blue, #a2eeef)
- `type: documentation` (gray, #0075ca)
- `type: question` (pink, #d876e3)

**Status Labels:**
- `status: needs-triage` (purple, #9c27b0)
- `status: in-progress` (yellow, #ffeb3b)
- `status: blocked` (red, #e53935)
- `status: needs-review` (orange, #ff9800)
- `status: ready-to-merge` (green, #4caf50)

**Special Labels:**
- `good first issue` (green, #7057ff) - Already exists
- `help wanted` (green, #008672) - Already exists
- `duplicate` (gray, #cfd3d7)
- `wontfix` (white, #ffffff)
- `breaking change` (red, #b60205)

### 3. GitHub Actions Secrets

No secrets needed for current workflows! But if you add features later:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Add secrets as needed (e.g., for NPM publishing, Discord notifications)

### 4. Social Preview

Create a social preview image for better sharing:

1. Go to **Settings** → **General** → **Social preview**
2. Upload an image (1280x640 recommended):
   - Use a tool like [Canva](https://canva.com) or Figma
   - Include: Plugin name, icon, key feature
   - Example text: "Block Select - Smart header-based text selection for Obsidian"

### 5. Create Release Notes Template

Create a template for consistent release notes:

