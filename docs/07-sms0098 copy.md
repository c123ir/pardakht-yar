# راهنمایی استفاده از لینک ارتباطی

## ).دل کد مورد نظر خود فراخوانی نمایی حفرمت لینک رابط به صورت زیر می باشد: (برای استفاده از لینک، آن را در م

```
https:// 0098 sms.com/sendsmslink.aspx?FROM=$FROM&TO=$TO&TEXT=$TEXT&USERNAME=$USERNAME
&PASSWORD=$PASSWORD&DOMAIN=$DOMAIN
```

لیست کدهای خطا به شرح زیر می باشد:

```
                                                           - : شماره اختصاصی متصل به لینک $FROM - متغیرهای درخواست شده به شرح زیر می باشند:
                                                        - یا همان شماره گیرنده پیامک )09xxxxxxxxx: شماره مقصد (با فرمت: $TO -
                                                                    - پیامک : متن $TEXT -
                                                              - : نام کاربری شما $USERNAME -
                                                                 - : رمز عبور شما$PASSWORD -
                                                                       - 0098 :$DOMAIN -
                                                  - شماره گیرنده اشتباه است توضیحات کد خطا
                                               - گیرنده تعریف نشده است
                                            - فرستنده تعریف نشده است
                                                     - متن تنظیم نشده است
                                      - نشده استنام کاربری تنظیم
                                         - کلمه عبور تنظیم نشده است
                                               - نام دامین تنظیم نشده است
                                               - مجوز شما باطل شده است
                                - اعتبار پیامک شما کافی نیست
           - برای این شماره لینک تعریف نشده است
                                      - عدم مجوز برای اتصال لینک
              - نام کاربری و کلمه ی عبور اشتباه است
                       - متن وجود دارد کاراکتر غیرمجاز در
                             - سقف ارسال روزانه پر شده است
                 - عدم مجوز شماره برای ارسال از لینک
     - خطا در شماره پنل. لطفا با پشیانی تماس بگیرید
```

* اتمام تاریخ اعتبار شماره پنل. برای استفاده تمدید شود

  - انجام نشده است optتنظیمات کد
  - صحیح نیست optفرمت کد
  - توسط ادمین تایید نشده است optتنظیمات کد
  - اطلاعات مالک شماره ثبت و تایید نشده است

  * هنوز اجازه ارسال به این شماره پنل داده نشده است
    - غیرمجاز انجام شده است IPارسال از
    - عملیات با موفقیت به پایان رسید.

**0098SMSسامانه ارسال پیامک web service راهنمای استفاده از**

آدرس وب سرویس به صورت زیر می باشد.

https://webservice.0098sms.com/service.asmx

اولیه را تغیر Name Space پس از اضافه نمودن ماژول وب سرویس توصیه می شود (نام)

(نقطه) را نداشته باشد. "."دهید و از نامی استفاده کنید که حرف

استفاده نمایید. SendSMSاز تابع در زمان فراخوانی ارسال پیامک تکیجهت - 1

SendSMSWithTimeجهت ارسال پیامک تکی با قابلیت تنظیم تاریخ و زمان، از تابع - 2

استفاده نمایید.

جهت ارسال پیامک تکی با قابلیت دریافت شناسه پیامک برای دریافت وضعیت، از تابع - 3

(خروجی این تابع در صورت موفقیت آمیز بودن، استفاده نمایید. SendSMSWithID

شناسه پیامک شماست)

جهت دریافت وضعیت پیامک (ارسال شده از طریق وب سرویس و دارا بودن شناسه - 4

استفاده نمایید. smsdeliveryState پیامک) از تابع

استفاده نمایید. RemainSms جهت دریافت مانده موجودی پیامک پنل از تابع - 5

می باشند و توضیح آن ها به شرح زیر است: Stringابع همگی از نوع وپارامتر های ورودی ت

**توضیح نوع نام پارامتر**

نام کاربری پنل^ String^ **Username**

پسورد پنل^ String^ **password**

پیامکمتن String **text**

شماره موبایل گیرنده پیامک String **MobileNo**

شماره اختصاصی پنل شما در سامانه String **PnlNo**

timestampتاریخ و ساعت مورد نظر برای ارسال در فرمت رقمی) 10 ( String^ **Timestmp**

stringرقمی در فرمت 9 عدد حداقل^ String^ **smsid**

Asp sample (sendsms)

```
ServiceReference1.ServiceSoapClient ss = new ServiceReference1.ServiceSoapClient();
```

```
string username = "username";
```

```
string password = "password";
```

```
string smstext = "smstext";
```

```
string mobileno = "091XXXXXXXX";
```

```
string panelno = "3000XXXX";
```

```
string responsecode = ss.SendSMS(username, password, smstext, mobileno, panelno);
```

Asp sample (SendSMSWithTime)

```
ServiceReference1.ServiceSoapClient ss = new ServiceReference1.ServiceSoapClient();
```

```
string username = "username";
```

```
string password = "password";
```

```
string smstext = "smstext";
```

```
string mobileno = "091XXXXXXXX";
```

```
string panelno = "3000XXXX";
```

```
string timestamp = " 1658939130 ";
```

```
string responsecode = ss.SendSMSwithtime(username, password, smstext, mobileno, panelno ,
timestamp);
```

Asp sample (SendSMSWithID)

```
ServiceReference1.ServiceSoapClient ss = new ServiceReference1.ServiceSoapClient();
```

```
string username = "username";
```

```
string password = "password";
```

```
string smstext = "smstext";
```

```
string mobileno = "091XXXXXXXX";
```

```
string panelno = "3000XXXX";
```

string responsecode = ss. SendSMSWithID (username, password, smstext, mobileno, panelno);

Asp sample (smsdeliveryState)

```
ServiceReference1.ServiceSoapClient ss = new ServiceReference1.ServiceSoapClient();
```

```
string username = "username";
```

```
string password = "password";
```

```
string smsid = "XXXXXXXXXX";
```

```
string deliverystate = ss.smsdeliveryState(username, password, smsid);
```

Asp sample (RemainSms)

```
ServiceReference1.ServiceSoapClient ss = new ServiceReference1.ServiceSoapClient();
```

```
string username = "username";
```

```
string password = "password";
```

```
string remain = ss.RemainSms(username, password);
```

Sample PHP(sendsms)

```
Enable extension=php_soap.dll
```

```
?<php
```

```
//turn off the WSDL cache
```

```
ini_set("soap.wsdl_cache_enabled", "0");
```

```
$sms_client = new
SoapClient('http://webservice.0098sms.com/service.asmx?wsdl',
array('encoding'=>'UTF-8'));
```

```
$parameters['username'] = "username;"...
```

```
$parameters['password'] = "password;"...
```

```
$parameters['mobileno'] = "0912;"...
```

```
$parameters['pnlno'] = "3000;"...
```

```
$parameters['text'] = "test";
```

```
$parameters['isflash'] =false;
```

```
echo $sms_client->SendSMS($parameters)->SendSMSResult;
```

```
>?
```

Sample PHP(SendSMSWithTime)

```
Enable extension=php_soap.dll
```

```
?<php
```

```
//turn off the WSDL cache
```

```
ini_set("soap.wsdl_cache_enabled", "0");
```

```
$sms_client = new
SoapClient('http://webservice.0098sms.com/service.asmx?wsdl',
array('encoding'=>'UTF-8'));
```

```
$parameters['username'] = "username;"...
```

```
$parameters['password'] = "password;"...
```

```
$parameters['mobileno'] = "0912;"...
```

```
$parameters['pnlno'] = "3000;"...
```

```
$parameters['text'] = "test";
```

```
$parameters['timestamp'] = " 1658939130 ";
```

```
$parameters['isflash'] =false;
```

```
echo $sms_client-> SendSMSwithtime($parameters)->SendSMSWithTimeResult;
```

```
>?
```

Sample PHP(SendSMSWithID)

Enable extension=php_soap.dll

```
?<php
```

```
//turn off the WSDL cache
```

```
ini_set("soap.wsdl_cache_enabled", "0");
```

```
$sms_client = new
SoapClient('http://webservice.0098sms.com/service.asmx?wsdl',
array('encoding'=>'UTF-8'));
```

```
$parameters['username'] = "username;"...
```

```
$parameters['password'] = "password;"...
```

```
$parameters['mobileno'] = "0912;"...
```

```
$parameters['pnlno'] = "3000;"...
```

```
$parameters['text'] = "test";
```

```
$parameters['isflash'] =false;
```

```
echo $sms_client->SendSMSWithID($parameters)->SendSMSWithIDResult;
```

```
>?
```

Sample PHP(smsdeliveryState)

Enable extension=php_soap.dll

```
?<php
```

```
//turn off the WSDL cache
```

```
ini_set("soap.wsdl_cache_enabled", "0");
```

```
$sms_client = new
SoapClient('http://webservice.0098sms.com/service.asmx?wsdl',
array('encoding'=>'UTF-8'));
```

```
$parameters['username'] = "username;"...
```

```
$parameters['password'] = "password;"...
```

```
$parameters['smsid'] = "xxxxxxxxxx";
```

```
$parameters['isflash'] =false;
```

echo $sms_client-> smsdeliveryState($parameters)-> smsdeliveryStateResult;

```
>?
```

Sample PHP(RemainSms)

Enable extension=php_soap.dll

```
?<php
```

```
//turn off the WSDL cache
```

```
ini_set("soap.wsdl_cache_enabled", "0");
```

```
$sms_client = new
SoapClient('http://webservice.0098sms.com/service.asmx?wsdl',
array('encoding'=>'UTF-8'));
```

```
$parameters['username'] = "username;"...
```

```
$parameters['password'] = "password;"...
```

```
$parameters['isflash'] =false;
```

echo $sms_client-> RemainSms($parameters)-> remainResult ;

```
>?
```

**لیست خطاهای وب سرویس**

```
توضیحات برگشتی کد
ارسال با موفقیت انجام شد 2
```

```
ارسال با موفقیت انجام شد (برای تابع ارسال با قابلیت دریافت دلیوری) رقمی 9 حداقل عدد
```

```
بگیرید تماس پشتیبانی با لطفا. عبور ی کلمه و کاربری نام تطابق عدم - 3
```

```
بگیرید تماس پشتیبانی با لطفا. است اشتباه عبور ی کلمه یا کاربری نام 10
```

```
.دارد وجود متن در مجاز غیر کاراکتر 11
```

```
.است خالی پیامک متن - 17
```

```
بگیرید تماس پشتیبانی با لطفا. شارژ خطای - 18
```

```
.نمایید پنل شارژ به اقدام لطفا. نیست کافی ارسال برای شما پنل شارژ - 19
```

```
.نیست صحیح موبایل شماره - 22
```

```
.بگیرید تماس پشتیبانی با لطفا. عبور ی کلمه و کاربری نام تطابق عدم 66
```

```
.دارد وجود متن در غیرمجاز کاراکتر 1111
```

```
.بگیرید تماس پشتیبانی با لطفا. است مسدود شما کاربری حساب Hang
.نمایید کامل را نام ثبت لطفا. است نگرفته انجام شما نام ثبت دوم مرحله No Doc
```

عدم مجوز شماره برای ارسال از لینک (^) **- 23**
شماره پنل. لطفا با پشیانی تماس بگیریدخطا در (^) **- 24**
اتمام تاریخ اعتبار شماره پنل. برای استفاده تمدید شود (^) **- 25**
انجام نشده است optتنظیمات کد **- 26**
صحیح نیست opt رمت کد ف **- 27**
توسط ادمین تایید نشده است opt کد تنظیمات **- 28
Wrong
timestamp**

### نیست تایم استمپ ارسال شده صحیح

زمان مورد نظر در بازه صحیح نیست (تنظیم زمان ارسال از همان روز تا یک سال بعد مجاز است) (^) **Wrong time**
صحیح نیست opt رمت کد ف **- 29**
یافت نشد. smsid **- 31**
مطابقت ندارد. smsid (^) **- 32**
مخاطب دریافت پیامهای تبلیغاتی خود را بسته است. (^) **4**
رسیده به گوشی (^) **5**
نرسیده به گوشی (^) **6**
وضعیت دریافت پیامک منقضی شده است (^) **7**
وضعیت پیامک نامشخص است. (^) **8**
اطلاعات مالک شماره، ثبت و تایید نشده است (^) **9**
هنوز اجازه ارسال به این شماره پنل داده نشده است (^) **12**
غیر مجاز انجام شده است. IPارسال از **13**
