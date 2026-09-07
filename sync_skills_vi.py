import os
import shutil

skills_dir = r'.claude/skills'

copied_files = []
ignored_files = []

for root, dirs, files in os.walk(skills_dir):
    for f in files:
        if f.endswith('.vi.md'):
            vi_path = os.path.join(root, f)
            main_name = f[:-6] + '.md'
            main_path = os.path.join(root, main_name)
            
            # Copy vi_path content to main_path
            shutil.copy2(vi_path, main_path)
            copied_files.append((vi_path, main_path))

print(f"Successfully copied {len(copied_files)} .vi.md files to primary .md files.")
for src, dst in copied_files:
    print(f"Copied: {src} -> {dst}")
