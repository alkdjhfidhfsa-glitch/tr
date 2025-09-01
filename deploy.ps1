Param(
    [string]$RepositoryUrl = "https://github.com/djjdkkfgg-eng/ooj.git",
    [string]$Branch = "main",
    [string]$CommitMessage = "Deploy to GitHub Pages (replace existing contents)",
    [switch]$ForceReplaceRemote
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Exec($cmd) {
    Write-Host ">> $cmd" -ForegroundColor Cyan
    iex $cmd
}

# Ensure Git is installed
try { git --version | Out-Null } catch { throw "Git is not installed or not in PATH. Download from https://git-scm.com/downloads" }

# Initialize repo if needed
$inRepo = $false
try { git rev-parse --is-inside-work-tree | Out-Null; $inRepo = $true } catch {}
if (-not $inRepo) {
    Exec "git init"
}

# Ensure branch
try { git rev-parse --verify $Branch | Out-Null } catch { Exec "git branch -M $Branch" }

# Configure remote origin
$hasOrigin = $true
try { $currentUrl = git remote get-url origin } catch { $hasOrigin = $false }
if ($hasOrigin) {
    if ($currentUrl -ne $RepositoryUrl) { Exec "git remote set-url origin $RepositoryUrl" }
} else {
    Exec "git remote add origin $RepositoryUrl"
}

# Add and commit changes (only if there are changes)
Exec "git add -A"
$porcelain = (git status --porcelain)
if ($porcelain -and $porcelain.Trim().Length -gt 0) {
    Exec "git commit -m `"$CommitMessage`""
} else {
    Write-Host "No changes to commit." -ForegroundColor Yellow
}

# Optional: replace remote contents by force pushing current tree
if ($ForceReplaceRemote) {
    Write-Warning "Force replacing remote contents with local repository (this overwrites remote history)."
    Exec "git fetch origin --prune"
    # Create a new root commit from current tree to avoid merging remote history
    $newCommit = (git commit-tree HEAD^{tree} -m `"$CommitMessage`")
    Exec "git reset --soft $newCommit"
}

# Push to remote
if ($ForceReplaceRemote) {
    Exec "git push -u origin $Branch --force"
} else {
    Exec "git push -u origin $Branch"
}

Write-Host "Done. If GitHub Actions is enabled for Pages, deployment will start automatically." -ForegroundColor Green