<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputOption;
use Module;
use Exception;

class MigrateModules extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'migrate:modules';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Run all module migrations';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function fire()
    {
        $migrations_path = join(DIRECTORY_SEPARATOR, [
            storage_path(), 'modules_migrations', ''
        ]);

        if (! is_dir($migrations_path)) {
            !mkdir($migrations_path);
        }

        $modules = Module::all();
        foreach ($modules as $module) {
            $directory = $module->getExtraPath(join(DIRECTORY_SEPARATOR, [
                'Database', 'Migrations'
            ]));

            $files = scandir($directory);

            $files = array_filter($files, function ($file) {
                return strpos($file, '.php') !== false;
            });

            foreach ($files as $file) {
                if (! copy($directory.DIRECTORY_SEPARATOR.$file, $migrations_path.DIRECTORY_SEPARATOR.$file)) {
                    throw new Exception('Error al copiar archivo');
                }
            }
        }

        $this->call('migrate', [
            '--path' => str_replace(base_path().DIRECTORY_SEPARATOR, '', $migrations_path)
        ]);
    }
}
