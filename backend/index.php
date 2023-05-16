<?php

/**
 *  TERMUX INDONESIA || RYUGENXD 2023
 */

error_reporting(0); 
ini_set('display_errors', 0);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
define("DB_HOST","<your database host");
define("DB_NAME","<your database name>");
define("DB_USER","<your database username>");
define("DB_PASS","<your database password>");
define("KEY","<entry your key>"); // key app backend ini akan bergunakan untuk metode encripty  dan verifikasi hak akses penguna


/**
 * 
 * CUMA LOGIC SEDERHANA YANG W RANCANG BRO
 * 
 * W GA SUKA MEMPERSINGKAT KODINGAN KECUAILI ITU PERLU  KALAU YANG KY GINI 
 * DI PERSIGNKAT RASA NYA GA PUAS NGODING NYA BRO SAMA KY PAKAI FRAMEWORK
 * KITA HANYA SETTING" AJA BERASA GITU APALAGI KALAU UNTUK PROJECT KECIL"AN
 * 
 * 
 */


##############################################################
# LIBRARY META HACK ( lib encrypti & decrypti )              #
# AUTHOR: RYUGENXD SDT PROJECTS TM      2021                 #
##############################################################

class MetaHack {
    private static $cip = "AES-128-CTR";
    private static $iv;
    private static $key = KEY;
    private static $op = 0;
    
    public function __construct() {
        self::$iv = openssl_random_pseudo_bytes(16);
    }
    
    public static function encHack($value) {
        $ascii_arr = array_map('ord', str_split($value));
        $ascii_str = implode(',', $ascii_arr);
        $en = openssl_encrypt($ascii_str, self::$cip, self::$key, self::$op, self::$iv);
        $en = base64_encode($en);
        $en = strtr($en, '+/', '-_');
        $en = preg_replace('/[^a-zA-Z0-9\-_]/', '', $en);
        return $en;
    }
    
    public static function decHack($value) {
        $value = strtr($value, '-_', '+/');
        $value = base64_decode($value);
        $de = openssl_decrypt($value, self::$cip, self::$key, self::$op, self::$iv);
        $ascii_arr = explode(',', $de);
        $text_arr = array_map('chr', $ascii_arr);
        $text_str = implode('', $text_arr);
        return $text_str;
    }
    
    public static function verify($param1, $param2) {
        if(self::decHack($param1) === $param2) {
            return true;
        } else {
            return false;
        }
    }
}




/**
 * Dackend ReactJS For Authentification
 */

class Database
{
    private string $host = DB_HOST;
    private string $name = DB_NAME;
    private string $user = DB_USER;
    private string $pass = DB_PASS;
    private PDO $dbh;
    private $stmt;

    public  function __construct()
    {
        /**
         * PHP Data Objects (PDO) 
         * merupakan sebuah extension/library
         * yang hadir bersamaan dengan direleasenya PHP versi 5. PDO 
         * dibangun menggunakan bahasa C/C++ 
         * dan PDO menawarkan sebuah paradigma pemrograman 
         * berorientasi object (Object Oriented Programming/OOP)
         * 
         * sumber : http://digilib.ubl.ac.id/ aawokwawkk tabahin dikit bro 😅
         */
        $pdo = "mysql:host={$this->host};dbname={$this->name}";
        $options = [
            PDO::ATTR_PERSISTENT=>true,
            PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION
        ];
        try
        {
            $this -> dbh = new PDO($pdo,$this->user,$this->pass,$options);
        }
        catch(PDOException $e)
        {
            die($e->getMessage());
        }
    }
    public function query($q)
    {
        $this -> stmt = $this -> dbh ->prepare($q);
    }
    public function bind($param,$value,$type=null)
    {
        if(is_null($type))
        {
            switch(true)
            {
              case is_int($value):
                $type = PDO::PARAM_INT;
                break;
              case is_bool($value):
                $type = PDO::PARAM_BOOL;
                break;
              case is_null($value):
                $type = PDO::PARAM_NULL;
                break;
              default:
                $type = PDO::PARAM_STR;
            }
          }
          $this->stmt->bindValue($param,$value,$type);
    }
    public function execute()
    {
        $this->stmt->execute();
    }
    public function resultSet()
    {
        $this->execute();
        return $this -> stmt -> fetchAll(PDO::FETCH_ASSOC);
    }
      
      public function single()
      {
        $this->execute();
        return $this->stmt->fetch(PDO::FETCH_ASSOC);
      }
      
      public function rowCount()
      {
        $this->execute();
        return $this->stmt->rowCount();
      }
}

class Auth 
{
    private string $table ="users";
    private $db;
    public $email;
    public $pass;
    public static $key=KEY;
    public function __construct()
    {
        $this -> db = new Database();
    }
    public function register()
    {
        $this -> pass = MetaHack::encHack($this->pass);
        $this -> db ->query("INSERT {$this->table} (email,password) VALUES (:email,:pass)");
        $this -> db -> bind('email',$this->email);
        $this -> db -> bind('pass',$this->pass);
        return $this -> db -> rowCount()>0?true:false;
    }
    public function login()
    {
        $this -> db ->query("SELECT * FROM {$this->table} WHERE email=:email");
        $this -> db -> bind('email',$this->email);
        if($this -> db ->rowCount()>0)
        {
            if(MetaHack::verify($this->db->single()["password"],$this->pass))
            {
                return "true";
            }else{
                return "false";
            }
        }
        return false;
    }
}
if(isset($_POST['API_KEY']))
{
    if($_POST['API_KEY'] == Auth::$key){
        if(isset($_POST['login']))
        {
            $authLogin = new Auth();
            if($_POST['login'])
            { 
                if(isset($_POST['email'])&&isset($_POST['pass']))
                {
                     $authLogin -> email = trim($_POST['email']);
                     $authLogin -> pass = trim($_POST['pass']);
                    //  echo json_encode([$authLogin->login()]);
                    //  return $authLogin->login();
                     if($authLogin->login()){
                        echo json_encode([
                            "status" => true,
                            "message" => "login success"
                         ]);
                     }else{
                        echo json_encode([
                            "status" => false,
                            "message" => "login failed"
                         ]);
                     }
                }else{
                    echo json_encode([
                        "status" => false,
                        "message" => "login failed"
                     ]);
                }
            }else{
                echo json_encode([
                    "status" => false,
                    "message" => "midleware login"
                ]);
            }
        }
        else if(isset($_POST['register']))
        {
            $authRegister = new Auth();
            if($_POST['register'])
            {
                if(isset($_POST['email'])&&isset($_POST['pass'])){
                    $authRegister -> email =trim($_POST['email']);
                    $authRegister -> pass = trim($_POST['pass']);
                    /**
                     * NEW ALGORIMA
                     */
                    // $res = var_dump($_POST);
                    // echo json_encode($res);
                    // echo json_encode(["data"=>"{$authRegister->email} pass : {$authRegister->pass}"]);
                    if($authRegister ->register())
                    {
                        echo json_encode([
                            "status" => true,
                            "message" => "register success"
                        ]);
                    }else{
                        echo json_encode([
                            "status" => false,
                            "message" => "register failed"
                        ]);
                    }
                }else{
                    echo json_encode([
                        "status" => false,
                        "message" => "register failed"
                    ]);
                }
                echo json_encode([
                    "status" => false,
                    "message" => "register failed"
                ]);
                
            }else{
                echo json_encode([
                    "status" => false,
                    "message" => "middleware register"
                ]);
            }
        }
        else{
            echo json_encode([
                "status" => true,
                "message" => "this is simpel API for ReactApp"
            ]);
        }
    }
    else{
        echo json_encode([
            "status" => true,
            "message" => "this is simpel API for ReactApp"
        ]);
    }
}
else{
    echo json_encode([
        "status" => true,
        "message" => "this is simpel API for ReactApp"
    ]);
}


/*
*   Finally future Auth 16 mei 2023
*  Touch by RYUGENXD 
*/ 
