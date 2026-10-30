// node --import ./tests/register.mjs --test tests/
import { register } from 'node:module';

register('./ts-hooks.mjs', import.meta.url);
