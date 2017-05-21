<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputOption;
use Module;
use Exception;

class MigrateModulesRollback extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'migrate:modules-rollback';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Rollaback module migrations';

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
    public function handle()
    {
        $migrations_path = storage_path().DIRECTORY_SEPARATOR.'modules_migrations'.DIRECTORY_SEPARATOR;

        $this->call('migrate:rollback', [
            '--path' => str_replace(base_path().DIRECTORY_SEPARATOR, '', $migrations_path)
        ]);
    }
}
