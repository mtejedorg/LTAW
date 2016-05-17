<?php
	header("Expires: -1");
	$str1 = date('h:i:s A');
	sleep(2);
	$str2 = date('h:i:s A');
	echo "$str1 -- $str2";
?>
