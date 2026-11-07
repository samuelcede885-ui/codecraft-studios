"""Offline smoke tests for the optional upstream DESIGN.md retrieval helper."""
import importlib.util
import io
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

SCRIPT = Path(__file__).resolve().parent.parent / 'scripts' / 'design_md.py'
SPEC = importlib.util.spec_from_file_location('design_md', SCRIPT)
mod = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(mod)

SAMPLE = b'# Stripe example\n\n## Colors\n- primary: #533afd\n\n## Typography\n- font: sans-serif\n'


class DesignMdTests(unittest.TestCase):
    def test_catalog_74_unique_brands(self):
        catalog = mod.read_catalog()
        self.assertEqual(len(catalog), 74)
        self.assertEqual(mod.slug_for('linear', catalog), 'linear.app')
        with self.assertRaises(ValueError):
            mod.slug_for('../evil', catalog)

    def test_offline_local_copy_and_refuse_overwrite(self):
        with tempfile.TemporaryDirectory() as root:
            local = Path(root) / 'local' / 'design-md' / 'stripe'
            local.mkdir(parents=True)
            (local / 'DESIGN.md').write_bytes(SAMPLE)
            out = Path(root) / 'output'
            command = ['--brand', 'stripe', '--offline', '--library', str(Path(root) / 'local'), '--project', str(out)]
            self.assertEqual(mod.main(command), 0)
            self.assertEqual((out / 'DESIGN.md').read_bytes(), SAMPLE)
            self.assertEqual(mod.main(command), 1)
            self.assertEqual(mod.main(command + ['--force']), 0)

    def test_offline_missing_is_error(self):
        with tempfile.TemporaryDirectory() as root:
            with patch.object(mod.Path, 'home', return_value=Path(root)):
                with patch.object(mod.Path, 'cwd', return_value=Path(root)):
                    with patch.dict(mod.os.environ, {}, clear=True):
                        with self.assertRaises(RuntimeError):
                            mod.get_design('stripe', offline=True, library=str(Path(root) / 'missing'))

    def test_mocked_remote_fetch(self):
        with tempfile.TemporaryDirectory() as root:
            with patch.object(mod.Path, 'home', return_value=Path(root)):
                with patch.object(mod.Path, 'cwd', return_value=Path(root)):
                    with patch('urllib.request.urlopen', return_value=io.BytesIO(SAMPLE)) as urlopen:
                        data, uri = mod.get_design('stripe', cache=False)
                        self.assertEqual(data, SAMPLE)
                        self.assertIn('raw.githubusercontent.com', uri)
                        self.assertEqual(urlopen.call_count, 1)


if __name__ == '__main__':
    unittest.main()
