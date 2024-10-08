import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import path from 'path';

export default tseslint.config(
	eslint.configs.recommended,
	...tseslint.configs.recommendedTypeChecked,
	{
		languageOptions: {
			parserOptions: {
				projectService: true,
				tsconfigRootDir: path.dirname(import.meta.url), // Gunakan dirname untuk root,
				allowDefaultProject: true,
			},
		},
		rules: {
			'@typescript-eslint/no-unused-vars': 'warn',
			'@typescript-eslint/explicit-function-return-type': 'off',
			'@typescript-eslint/no-explicit-any': 'off', // Menonaktifkan larangan penggunaan any
			'@typescript-eslint/no-unsafe-assignment': 'off', // Menonaktifkan peringatan untuk penugasan unsafe
			'@typescript-eslint/no-unsafe-member-access': 'off', // Menonaktifkan peringatan untuk akses member unsafe
			'indent': ['error', 4],
			'quotes': ['error', 'single'],
			'semi': ['error', 'always'],
		}    
	},
);
